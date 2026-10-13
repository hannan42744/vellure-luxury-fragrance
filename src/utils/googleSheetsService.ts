import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut,
  User
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);

// Provider with required Google Sheets Workspace scope
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/spreadsheets');
provider.setCustomParameters({
  prompt: 'select_account'
});

// Flag to indicate ongoing sign-in flow
let isSigningIn = false;
// In-memory token cache (never stored in localStorage/sessionStorage per security guidelines)
let cachedAccessToken: string | null = null;
let cachedUser: User | null = null;

// Auth state listeners
type AuthCallback = (user: User | null, token: string | null) => void;
const listeners = new Set<AuthCallback>();

export const notifyListeners = () => {
  listeners.forEach(cb => cb(cachedUser, cachedAccessToken));
};

export const subscribeGoogleAuth = (callback: AuthCallback) => {
  listeners.add(callback);
  callback(cachedUser, cachedAccessToken);
  return () => {
    listeners.delete(callback);
  };
};

// Initialize auth state listener. Call this on app load.
export const initGoogleAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    cachedUser = user;
    if (user && cachedAccessToken) {
      if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      notifyListeners();
    } else {
      if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
        notifyListeners();
      }
    }
  });
};

// Interactive Google Sign-In with popup
export const signInWithGoogle = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to obtain Google Sheets access token from Google Auth');
    }

    cachedAccessToken = credential.accessToken;
    cachedUser = result.user;
    notifyListeners();
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Google Sign-In error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getGoogleAccessToken = (): string | null => {
  return cachedAccessToken;
};

export const getGoogleUser = (): User | null => {
  return cachedUser;
};

export const logoutGoogle = async () => {
  try {
    await signOut(auth);
  } finally {
    cachedAccessToken = null;
    cachedUser = null;
    notifyListeners();
  }
};

// ================= GOOGLE SHEETS API UTILITIES =================

export interface SheetMetadata {
  spreadsheetId: string;
  title: string;
  sheets: {
    sheetId: number;
    title: string;
    index: number;
    rowCount?: number;
    columnCount?: number;
  }[];
}

export interface SheetRowItem {
  rowIndex: number; // 1-based row index in sheet
  sku: string;
  name: string;
  stock: number;
  price3ml?: number;
  price6ml?: number;
  status: 'In Stock' | 'Out of Stock';
  rawRow: any[];
}

// Extract Spreadsheet ID from standard Google Sheets URL or raw ID
export function extractSpreadsheetId(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  // Match standard URL format: https://docs.google.com/spreadsheets/d/{SPREADSHEET_ID}/edit
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
}

// Fetch spreadsheet details (tabs, title)
export async function fetchSpreadsheetInfo(
  spreadsheetId: string,
  token?: string | null
): Promise<SheetMetadata> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('Please sign in with Google to access Google Sheets.');
  }

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cleanId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status}: Failed to load spreadsheet`;
    throw new Error(message);
  }

  const data = await response.json();
  return {
    spreadsheetId: cleanId,
    title: data.properties?.title || 'Google Sheet',
    sheets: (data.sheets || []).map((s: any) => ({
      sheetId: s.properties?.sheetId,
      title: s.properties?.title,
      index: s.properties?.index,
      rowCount: s.properties?.gridProperties?.rowCount,
      columnCount: s.properties?.gridProperties?.columnCount
    }))
  };
}

// Fetch inventory rows from specified sheet and range
export async function fetchSheetInventory(
  spreadsheetId: string,
  tabName?: string,
  token?: string | null
): Promise<{ title: string; rows: SheetRowItem[]; rawValues: any[][] }> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('Please sign in with Google to read inventory from Google Sheet.');
  }

  const cleanId = extractSpreadsheetId(spreadsheetId);
  // If tabName is not specified, get metadata first to avoid hardcoded "Sheet1"
  let sheetTitle = tabName;
  if (!sheetTitle) {
    const info = await fetchSpreadsheetInfo(cleanId, accessToken);
    sheetTitle = info.sheets[0]?.title || 'Sheet1';
  }

  const range = `'${sheetTitle}'!A1:Z100`;
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(range)}`;

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || 'Failed to fetch inventory rows from Google Sheet');
  }

  const data = await response.json();
  const values: any[][] = data.values || [];

  if (values.length === 0) {
    return { title: sheetTitle, rows: [], rawValues: [] };
  }

  // Detect header columns dynamically
  const headerRow = values[0].map((h: any) => String(h || '').trim().toLowerCase());
  let skuCol = headerRow.findIndex(h => h.includes('sku') || h.includes('code') || h.includes('আইডি'));
  let nameCol = headerRow.findIndex(h => h.includes('name') || h.includes('title') || h.includes('নাম') || h.includes('product'));
  let stockCol = headerRow.findIndex(h => h.includes('stock') || h.includes('qty') || h.includes('quantity') || h.includes('মজুদ') || h.includes('পরিমাণ'));
  let price3mlCol = headerRow.findIndex(h => h.includes('3ml') || (h.includes('price') && !h.includes('6ml')));
  let price6mlCol = headerRow.findIndex(h => h.includes('6ml'));

  // Sensible fallbacks if no header row was detected
  if (skuCol === -1) skuCol = 0;
  if (nameCol === -1) nameCol = 1;
  if (stockCol === -1) stockCol = 2;

  const rows: SheetRowItem[] = [];
  const startRowIndex = (headerRow.some(h => isNaN(Number(h)))) ? 1 : 0;

  for (let i = startRowIndex; i < values.length; i++) {
    const row = values[i];
    if (!row || row.length === 0) continue;

    const sku = String(row[skuCol] || '').trim();
    const name = String(row[nameCol] || '').trim();
    const stockRaw = row[stockCol];
    const stock = isNaN(parseInt(stockRaw, 10)) ? 0 : Math.max(0, parseInt(stockRaw, 10));

    if (!sku && !name) continue;

    rows.push({
      rowIndex: i + 1, // 1-indexed for Sheet formulas
      sku,
      name,
      stock,
      price3ml: price3mlCol >= 0 ? Number(row[price3mlCol]) : undefined,
      price6ml: price6mlCol >= 0 ? Number(row[price6mlCol]) : undefined,
      status: stock > 0 ? 'In Stock' : 'Out of Stock',
      rawRow: row
    });
  }

  return {
    title: sheetTitle,
    rows,
    rawValues: values
  };
}

// Convert column index (0-based) to letter (A, B, C...)
function colToLetter(colIndex: number): string {
  let temp = colIndex;
  let letter = '';
  while (temp >= 0) {
    letter = String.fromCharCode((temp % 26) + 65) + letter;
    temp = Math.floor(temp / 26) - 1;
  }
  return letter;
}

// Deduct stock in Google Sheet with user confirmation (Workspace Skill requirement)
export async function deductStockFromSheet(
  spreadsheetId: string,
  tabName: string,
  items: { sku?: string; name?: string; quantity: number }[],
  token?: string | null
): Promise<{ success: boolean; updatedRows: { name: string; sku: string; oldStock: number; newStock: number }[] }> {
  const accessToken = token || cachedAccessToken;
  if (!accessToken) {
    throw new Error('Google OAuth token required to update Google Sheet.');
  }

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const currentSheet = await fetchSheetInventory(cleanId, tabName, accessToken);

  const values = currentSheet.rawValues;
  if (!values || values.length === 0) {
    throw new Error('Cannot deduct stock: Google Sheet is empty.');
  }

  // Find stock column index
  const headerRow = values[0].map((h: any) => String(h || '').trim().toLowerCase());
  let stockCol = headerRow.findIndex(h => h.includes('stock') || h.includes('qty') || h.includes('quantity') || h.includes('মজুদ'));
  if (stockCol === -1) stockCol = 2; // Default column C

  const stockLetter = colToLetter(stockCol);
  const updates: { range: string; values: any[][] }[] = [];
  const updatedRows: { name: string; sku: string; oldStock: number; newStock: number }[] = [];

  for (const item of items) {
    const qty = Math.max(1, item.quantity || 1);
    const matched = currentSheet.rows.find(r =>
      (item.sku && r.sku && r.sku.toLowerCase() === item.sku.toLowerCase()) ||
      (item.name && r.name && r.name.toLowerCase() === item.name.toLowerCase())
    );

    if (matched) {
      const oldStock = matched.stock;
      const newStock = Math.max(0, oldStock - qty);
      const cellRange = `'${currentSheet.title}'!${stockLetter}${matched.rowIndex}`;
      updates.push({
        range: cellRange,
        values: [[newStock]]
      });
      updatedRows.push({
        name: matched.name,
        sku: matched.sku,
        oldStock,
        newStock
      });
    }
  }

  if (updates.length === 0) {
    return { success: true, updatedRows: [] };
  }

  // Batch update values in sheet
  const batchUrl = `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values:batchUpdate`;
  const res = await fetch(batchUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      valueInputOption: 'USER_ENTERED',
      data: updates
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to update Google Sheet cell values.');
  }

  return { success: true, updatedRows };
}

// Generate Google Apps Script code for 2-way live sync webhook
export function generateGoogleAppsScript(siteUrl: string = window.location.origin): string {
  return `/**
 * VELLURE Luxury Fragrance — Live Inventory Sync Webhook
 * Sheet Name: Vellure Fragrances - Inventory
 * Email: info.vellurefragrances@gmail.com
 *
 * HOW TO INSTALL IN GOOGLE SHEETS:
 * 1. Open your Google Sheet ("Vellure Fragrances - Inventory").
 * 2. Click "Extensions" > "Apps Script".
 * 3. Replace all code with this script.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set "Execute as": "Me".
 * 7. Set "Who has access": "Anyone".
 * 8. Click "Deploy", copy the Web App URL, and paste it into your VELLURE Admin Settings!
 */

function doGet(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = sheet.getDataRange().getValues();
  if (data.length < 2) {
    return ContentService.createTextOutput(JSON.stringify({ items: [] }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
  var skuIdx = headers.indexOf('sku') !== -1 ? headers.indexOf('sku') : 0;
  var nameIdx = headers.indexOf('name') !== -1 ? headers.indexOf('name') : 1;
  var stockIdx = headers.indexOf('stock') !== -1 ? headers.indexOf('stock') : 2;

  var items = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    items.push({
      sku: String(row[skuIdx] || ''),
      name: String(row[nameIdx] || ''),
      stock: parseInt(row[stockIdx] || 0, 10),
      status: parseInt(row[stockIdx] || 0, 10) > 0 ? 'In Stock' : 'Out of Stock'
    });
  }

  return ContentService.createTextOutput(JSON.stringify({
    sheetName: "Vellure Fragrances - Inventory",
    updatedAt: new Date().toISOString(),
    total: items.length,
    items: items
  })).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  try {
    var payload = JSON.parse(e.postData.contents);
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();
    var headers = data[0].map(function(h) { return String(h).trim().toLowerCase(); });
    var skuIdx = headers.indexOf('sku') !== -1 ? headers.indexOf('sku') : 0;
    var nameIdx = headers.indexOf('name') !== -1 ? headers.indexOf('name') : 1;
    var stockIdx = headers.indexOf('stock') !== -1 ? headers.indexOf('stock') : 2;

    if (payload.action === 'deduct_stock' && payload.items) {
      for (var j = 0; j < payload.items.length; j++) {
        var it = payload.items[j];
        var deductQty = Number(it.quantity) || 1;
        for (var r = 1; r < data.length; r++) {
          var rowSku = String(data[r][skuIdx] || '').trim().toLowerCase();
          var rowName = String(data[r][nameIdx] || '').trim().toLowerCase();
          if ((it.sku && rowSku === it.sku.toLowerCase()) || (it.name && rowName === it.name.toLowerCase())) {
            var curr = parseInt(data[r][stockIdx] || 0, 10);
            var nextStock = Math.max(0, curr - deductQty);
            sheet.getRange(r + 1, stockIdx + 1).setValue(nextStock);
            break;
          }
        }
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true, message: "Stock updated successfully" }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
`;
}

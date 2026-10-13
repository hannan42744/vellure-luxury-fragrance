import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';
import { formatBDT } from '../utils/translations';
import { GoogleSignInButton } from './GoogleSignInButton';
import {
  signInWithGoogle,
  logoutGoogle,
  subscribeGoogleAuth,
  getGoogleAccessToken,
  getGoogleUser,
  fetchSpreadsheetInfo,
  fetchSheetInventory,
  deductStockFromSheet,
  generateGoogleAppsScript,
  extractSpreadsheetId,
  SheetRowItem
} from '../utils/googleSheetsService';
import {
  FileSpreadsheet,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Copy,
  Check,
  Package,
  Layers,
  Send,
  Download,
  ShieldAlert,
  ArrowRight,
  LogOut,
  Info
} from 'lucide-react';

export const GoogleSheetsInventoryPanel: React.FC = () => {
  const { products, refreshProducts, settings, refreshSettings, language, adminToken } = useApp();

  // Google Auth State
  const [googleUser, setGoogleUser] = useState(getGoogleUser());
  const [googleToken, setGoogleToken] = useState(getGoogleAccessToken());
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [authError, setAuthError] = useState('');

  // Sheet configuration state
  const [sheetInput, setSheetInput] = useState(
    settings.googleSheetId ||
    settings.googleSheetWebhookUrl ||
    'https://script.google.com/macros/s/AKfycbyi2tSRCnHp2SV1XTMorD9miR0rV3CN1HPvVgCQeWOxNwDG11IxqnZdIdgEO2oawXe9sQ/exec'
  );
  const [selectedTab, setSelectedTab] = useState(settings.googleSheetRange?.split('!')[0] || '');
  const [availableTabs, setAvailableTabs] = useState<string[]>([]);
  const [webhookUrlInput, setWebhookUrlInput] = useState(
    settings.googleSheetWebhookUrl ||
    'https://script.google.com/macros/s/AKfycbyi2tSRCnHp2SV1XTMorD9miR0rV3CN1HPvVgCQeWOxNwDG11IxqnZdIdgEO2oawXe9sQ/exec'
  );

  // Live Sync State
  const [loadingSheet, setLoadingSheet] = useState(false);
  const [sheetRows, setSheetRows] = useState<SheetRowItem[]>([]);
  const [syncStatus, setSyncStatus] = useState<string>(settings.googleSheetSyncStatus || 'idle');
  const [syncMessage, setSyncMessage] = useState<string>(
    settings.googleSheetSyncMessage || 'Configured for sheet: Vellure Fragrances - Inventory'
  );
  const [lastSyncTime, setLastSyncTime] = useState<string>(settings.googleSheetLastSync || '');

  // Destructive Action Confirmation Modal state (Workspace integration requirement)
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    type: 'sync_to_site' | 'deduct_from_sheet';
    description: string;
    details: { name: string; sku: string; currentStock: number; targetStock: number }[];
    onConfirm: () => Promise<void>;
  } | null>(null);
  const [confirmingAction, setConfirmingAction] = useState(false);

  // Manual Messenger Stock Deduction Form
  const [messengerSelectedProd, setMessengerSelectedProd] = useState(products[0]?.id || '');
  const [messengerDeductQty, setMessengerDeductQty] = useState(1);
  const [messengerOrderRef, setMessengerOrderRef] = useState('');
  const [messengerSuccessMsg, setMessengerSuccessMsg] = useState('');

  // Apps Script code copy state
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedCsv, setCopiedCsv] = useState(false);

  // Listen to Google Auth state
  useEffect(() => {
    const unsubscribe = subscribeGoogleAuth((user, token) => {
      setGoogleUser(user);
      setGoogleToken(token);
    });
    return unsubscribe;
  }, []);

  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    setIsSigningIn(true);
    setAuthError('');
    try {
      const res = await signInWithGoogle();
      if (res?.user) {
        setGoogleUser(res.user);
        setGoogleToken(res.accessToken);
        setSyncStatus('connected');
        setSyncMessage(`Authenticated with Google account: ${res.user.email}`);
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      setAuthError(err.message || 'Google authentication was closed or cancelled.');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Google Logout
  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setGoogleUser(null);
    setGoogleToken(null);
    setSyncStatus('idle');
  };

  // Load Sheet Tabs & Metadata
  const handleInspectSheet = async () => {
    if (!sheetInput) return;
    setLoadingSheet(true);
    setAuthError('');

    try {
      const cleanId = extractSpreadsheetId(sheetInput);
      if (googleToken) {
        const info = await fetchSpreadsheetInfo(cleanId, googleToken);
        const tabs = info.sheets.map(s => s.title);
        setAvailableTabs(tabs);
        if (tabs.length > 0 && !selectedTab) {
          setSelectedTab(tabs[0]);
        }
        setSyncMessage(`Found spreadsheet "${info.title}" with tabs: ${tabs.join(', ')}`);
      } else {
        setSyncMessage(`Spreadsheet identifier set: "${sheetInput}". Sign in with Google to inspect tabs directly.`);
      }
    } catch (err: any) {
      setAuthError(err.message || 'Could not load Google Sheet properties. Check permissions.');
    } finally {
      setLoadingSheet(false);
    }
  };

  // Fetch Live Inventory from Google Sheet
  const handleFetchSheetInventory = async () => {
    setLoadingSheet(true);
    setAuthError('');

    try {
      const cleanId = extractSpreadsheetId(sheetInput);
      if (googleToken && cleanId) {
        const result = await fetchSheetInventory(cleanId, selectedTab || undefined, googleToken);
        setSheetRows(result.rows);

        // Prepare comparison details for confirmation dialog
        const comparison = result.rows.map(row => {
          const matchedProd = products.find(p =>
            (row.sku && p.sku && p.sku.toLowerCase() === row.sku.toLowerCase()) ||
            (row.name && p.name && p.name.toLowerCase() === row.name.toLowerCase())
          );
          return {
            name: row.name,
            sku: row.sku,
            currentStock: matchedProd ? (matchedProd.stock ?? 0) : 0,
            targetStock: row.stock
          };
        });

        // Prompt user confirmation to update website stock with Google Sheet values
        setPendingAction({
          type: 'sync_to_site',
          description: `Update website stock for ${comparison.length} attars from Google Sheet "${result.title}"?`,
          details: comparison,
          onConfirm: async () => {
            // Send sheet rows to server
            const res = await fetch('/api/inventory/sheet-sync', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${adminToken}`
              },
              body: JSON.stringify({ sheetRows: result.rows })
            });
            const data = await res.json();
            if (res.ok && data.success) {
              await refreshProducts();
              setSyncStatus('connected');
              const now = new Date().toLocaleString();
              setLastSyncTime(now);
              setSyncMessage(`Successfully synchronized ${data.updatedCount} attars with Google Sheet!`);
            } else {
              throw new Error(data.error || 'Failed to sync with website database.');
            }
          }
        });
        setConfirmModalOpen(true);
      } else if (webhookUrlInput) {
        // Trigger server-side webhook sync
        const res = await fetch('/api/inventory/sheet-sync', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({ webhookUrl: webhookUrlInput })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          await refreshProducts();
          await refreshSettings();
          setLastSyncTime(new Date().toLocaleString());
          setSyncStatus('connected');
          setSyncMessage(data.message || `Synchronized via Webhook. Updated ${data.updatedCount} products.`);
        } else {
          throw new Error(data.error || 'Webhook sync failed.');
        }
      } else {
        setAuthError('Please sign in with Google or provide an Apps Script Webhook URL.');
      }
    } catch (err: any) {
      console.error('Inventory fetch error:', err);
      setAuthError(err.message || 'Error communicating with Google Sheet.');
    } finally {
      setLoadingSheet(false);
    }
  };

  // Execute Confirmed Mutating Operation (Workspace skill compliance)
  const handleExecuteConfirmedAction = async () => {
    if (!pendingAction) return;
    setConfirmingAction(true);
    try {
      await pendingAction.onConfirm();
      setConfirmModalOpen(false);
      setPendingAction(null);
    } catch (err: any) {
      setAuthError(err.message || 'Action failed during execution.');
    } finally {
      setConfirmingAction(false);
    }
  };

  // Handle Messenger / WhatsApp Order stock deduction
  const handleDeductMessengerStock = async (e: React.FormEvent) => {
    e.preventDefault();
    const prod = products.find(p => p.id === messengerSelectedProd);
    if (!prod) return;

    const ref = messengerOrderRef.trim() || `MSGR-${Date.now().toString().slice(-6)}`;
    const newStock = Math.max(0, (prod.stock || 0) - messengerDeductQty);

    setPendingAction({
      type: 'deduct_from_sheet',
      description: `Deduct ${messengerDeductQty} unit(s) of "${prod.name}" for order ${ref}? This will update the website stock and Google Sheet inventory.`,
      details: [
        {
          name: prod.name,
          sku: prod.sku,
          currentStock: prod.stock || 0,
          targetStock: newStock
        }
      ],
      onConfirm: async () => {
        // 1. Deduct in website database
        const res = await fetch('/api/inventory/deduct', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`
          },
          body: JSON.stringify({
            orderRef: ref,
            source: 'messenger',
            items: [{ productId: prod.id, sku: prod.sku, name: prod.name, quantity: messengerDeductQty }]
          })
        });
        const data = await res.json();

        // 2. If Google OAuth is connected and sheet ID is provided, deduct directly in Google Sheet too
        const cleanId = extractSpreadsheetId(sheetInput);
        if (googleToken && cleanId) {
          try {
            await deductStockFromSheet(
              cleanId,
              selectedTab || 'Sheet1',
              [{ sku: prod.sku, name: prod.name, quantity: messengerDeductQty }],
              googleToken
            );
          } catch (sheetErr) {
            console.warn('Direct Google Sheet cell deduction note:', sheetErr);
          }
        }

        await refreshProducts();
        setMessengerSuccessMsg(
          `Successfully deducted ${messengerDeductQty}x ${prod.name} for ${ref}. Remaining stock: ${newStock}`
        );
        setTimeout(() => setMessengerSuccessMsg(''), 6000);
      }
    });
    setConfirmModalOpen(true);
  };

  // Save Settings to Server
  const handleSaveSettings = async () => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          googleSheetId: extractSpreadsheetId(sheetInput),
          googleSheetName: 'Vellure Fragrances - Inventory',
          googleSheetEmail: 'info.vellurefragrances@gmail.com',
          googleSheetWebhookUrl: webhookUrlInput,
          googleSheetRange: selectedTab ? `${selectedTab}!A2:E` : 'Sheet1!A2:E'
        })
      });
      if (res.ok) {
        await refreshSettings();
        setSyncMessage('Settings saved successfully.');
      }
    } catch (err: any) {
      setAuthError('Failed to save settings: ' + err.message);
    }
  };

  // Copy Google Apps Script code
  const handleCopyScript = () => {
    const code = generateGoogleAppsScript();
    navigator.clipboard.writeText(code);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 3000);
  };

  // Generate Catalog CSV Template for Google Sheets
  const handleCopyCsv = () => {
    const headers = ['SKU', 'Product Name', 'Stock', 'Price (3ml)', 'Price (6ml)', 'Status'];
    const rows = products.map(p => [
      p.sku || '',
      `"${p.name.replace(/"/g, '""')}"`,
      p.stock ?? 0,
      p.price3ml,
      p.price6ml,
      (p.stock ?? 0) > 0 ? 'In Stock' : 'Out of Stock'
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    navigator.clipboard.writeText(csvContent);
    setCopiedCsv(true);
    setTimeout(() => setCopiedCsv(false), 3000);
  };

  const inStockCount = products.filter(p => (p.stock ?? 0) > 0).length;
  const outOfStockCount = products.filter(p => (p.stock ?? 0) <= 0).length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#17161C] via-[#1C1A24] to-[#121116] border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] text-[11px] font-mono uppercase tracking-wider">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Google Sheets Live Inventory Synchronization</span>
            </div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide">
              {language === 'bn' ? 'গুগল শিট লাইভ ইনভেন্টরি সিঙ্ক' : 'Google Sheets Live Inventory'}
            </h3>
            <p className="text-xs text-[#A8A49C] max-w-2xl">
              Connect your Google Sheet <span className="text-[#D4AF37] font-semibold">"Vellure Fragrances - Inventory"</span> (<span className="text-white font-mono">info.vellurefragrances@gmail.com</span>) to synchronize real-time stock levels, auto-badge Out of Stock attars, and deduct inventory on completed orders.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-[#121115] border border-[#2B2934] px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-[#8E8B83] uppercase block font-mono">Total Catalog</span>
              <span className="font-mono text-base font-bold text-white">{products.length}</span>
            </div>
            <div className="bg-emerald-950/40 border border-emerald-800/40 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-emerald-400 uppercase block font-mono">In Stock</span>
              <span className="font-mono text-base font-bold text-emerald-300">{inStockCount}</span>
            </div>
            <div className="bg-rose-950/40 border border-rose-800/40 px-3.5 py-2 rounded-xl text-center">
              <span className="text-[10px] text-rose-400 uppercase block font-mono">Out of Stock</span>
              <span className="font-mono text-base font-bold text-rose-300">{outOfStockCount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Authentication & Connection Card */}
      <div className="bg-[#141318] border border-[#26242E] rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#23222A]">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#D4AF37]" />
              <span>Google Account & Sheets Authorization</span>
            </h4>
            <p className="text-xs text-[#8E8B83] mt-0.5">
              Target Account: <strong className="text-white">info.vellurefragrances@gmail.com</strong> | Sheet: <strong className="text-[#D4AF37]">Vellure Fragrances - Inventory</strong>
            </p>
          </div>

          {/* Google Sign-in / Logout Action */}
          <div>
            {googleUser ? (
              <div className="flex items-center gap-3 bg-[#1A1921] border border-[#312F3D] px-3.5 py-1.5 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="text-left">
                  <span className="text-[10px] text-[#8E8B83] block leading-none">Connected as</span>
                  <span className="text-xs text-white font-medium">{googleUser.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleGoogleLogout}
                  className="ml-2 p-1.5 text-[#8E8B83] hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                  title="Sign out of Google"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <GoogleSignInButton
                onClick={handleGoogleSignIn}
                loading={isSigningIn}
                label="Sign in with Google to Connect Sheets"
              />
            )}
          </div>
        </div>

        {authError && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{authError}</span>
          </div>
        )}

        {/* Spreadsheet Link or ID Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-1">
          <div className="md:col-span-6 space-y-1">
            <label className="text-[11px] font-mono text-[#C5A059] uppercase block">
              Google Sheet URL or Spreadsheet ID
            </label>
            <input
              type="text"
              value={sheetInput}
              onChange={(e) => setSheetInput(e.target.value)}
              placeholder="Paste Google Sheet URL or ID (e.g., 1BxiMVs0XRA5...)"
              className="w-full bg-[#18171F] border border-[#2E2C37] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#5C5954] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="md:col-span-3 space-y-1">
            <label className="text-[11px] font-mono text-[#C5A059] uppercase block">
              Sheet Tab Name
            </label>
            {availableTabs.length > 0 ? (
              <select
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                className="w-full bg-[#18171F] border border-[#2E2C37] rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              >
                {availableTabs.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={selectedTab}
                onChange={(e) => setSelectedTab(e.target.value)}
                placeholder="Sheet1 or Inventory"
                className="w-full bg-[#18171F] border border-[#2E2C37] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#5C5954] focus:outline-none focus:border-[#D4AF37]"
              />
            )}
          </div>

          <div className="md:col-span-3 flex items-end gap-2">
            <button
              type="button"
              onClick={handleInspectSheet}
              disabled={loadingSheet}
              className="py-2 px-3 rounded-xl bg-[#22202A] hover:bg-[#2B2936] border border-[#343240] text-xs text-white font-medium transition-colors cursor-pointer disabled:opacity-50"
            >
              Inspect
            </button>
            <button
              type="button"
              onClick={handleSaveSettings}
              className="py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-xs text-black font-semibold transition-colors cursor-pointer"
            >
              Save Link
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        <div className="p-3 rounded-xl bg-[#18171E] border border-[#26242F] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-[#A8A49C]">
            <span className={`w-2 h-2 rounded-full ${syncStatus === 'connected' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
            <span>{syncMessage}</span>
          </div>

          <div className="flex items-center gap-2">
            {lastSyncTime && (
              <span className="text-[11px] font-mono text-[#7A7771]">
                Last synced: {lastSyncTime}
              </span>
            )}
            <button
              type="button"
              onClick={handleFetchSheetInventory}
              disabled={loadingSheet}
              className="py-1.5 px-3 rounded-lg bg-[#D4AF37] hover:bg-[#C5A059] text-black font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loadingSheet ? 'animate-spin' : ''}`} />
              <span>{loadingSheet ? 'Syncing...' : 'Sync Stock Live'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. Live Product Stock Status Catalog */}
      <div className="bg-[#141318] border border-[#26242E] rounded-2xl overflow-hidden shadow-md">
        <div className="p-4 sm:p-5 border-b border-[#23222A] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#D4AF37]" />
              <span>Catalog Stock & Status Preview</span>
            </h4>
            <p className="text-xs text-[#8E8B83]">
              Stock &lt;= 0 automatically badges as "Out of Stock" and disables ordering.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyCsv}
              className="py-1.5 px-3 rounded-lg bg-[#1B1A22] hover:bg-[#25242E] border border-[#312F3D] text-[#D4AF37] text-xs font-mono transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Copy catalog CSV with SKU, Name, and Stock headers for your Google Sheet"
            >
              {copiedCsv ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCsv ? 'Copied CSV!' : 'Copy Sheet Template CSV'}</span>
            </button>
          </div>
        </div>

        {/* Product Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#17161C] border-b border-[#23222A] text-[10px] font-mono uppercase text-[#A8A49C]">
              <tr>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Attar Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-3 text-center">3ml Stock</th>
                <th className="py-3 px-3 text-center">6ml Stock</th>
                <th className="py-3 px-4 text-center">Total Stock</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">3ml Price</th>
                <th className="py-3 px-4 text-right">6ml Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1E26]">
              {products.map((p) => {
                const isOut = (p.stock ?? 0) <= 0;
                return (
                  <tr key={p.id} className="hover:bg-[#1A1921] transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-[#D4AF37]">
                      {p.sku || 'N/A'}
                    </td>
                    <td className="py-3 px-4 font-medium text-white">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover bg-black border border-[#2B2934] shrink-0"
                        />
                        <div>
                          <span>{p.name}</span>
                          {p.nameBn && <span className="block text-[10px] text-[#7A7771]">{p.nameBn}</span>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#8E8B83] uppercase tracking-wider text-[10px]">
                      {p.fragranceType || p.category}
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs ${(p.stock3ml ?? p.stock) <= 0 ? 'text-rose-400 font-bold' : 'text-[#E2DFD8]'}`}>
                        {p.stock3ml !== undefined ? p.stock3ml : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className={`px-2 py-0.5 rounded text-xs ${(p.stock6ml ?? p.stock) <= 0 ? 'text-rose-400 font-bold' : 'text-[#E2DFD8]'}`}>
                        {p.stock6ml !== undefined ? p.stock6ml : '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        isOut ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' : 'bg-emerald-950/50 text-emerald-300 border border-emerald-800/40'
                      }`}>
                        {p.stock ?? 0}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isOut ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded-full border border-rose-700/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                          Out of Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-700/40">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-[#D4AF37]">
                      {formatBDT(p.price3ml)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-white">
                      {formatBDT(p.price6ml)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Messenger / WhatsApp Manual Order Stock Deduction */}
      <div className="bg-[#141318] border border-[#26242E] rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-[#23222A] pb-3">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Send className="w-4 h-4 text-[#D4AF37]" />
              <span>Messenger & WhatsApp Order Stock Deduction</span>
            </h4>
            <p className="text-xs text-[#8E8B83]">
              Deduct inventory in real-time when orders arrive through Facebook Messenger or WhatsApp.
            </p>
          </div>
        </div>

        {messengerSuccessMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{messengerSuccessMsg}</span>
          </div>
        )}

        <form onSubmit={handleDeductMessengerStock} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-5 space-y-1">
            <label className="text-[11px] font-mono text-[#C5A059] uppercase block">
              Select Attar to Deduct
            </label>
            <select
              value={messengerSelectedProd}
              onChange={(e) => setMessengerSelectedProd(e.target.value)}
              className="w-full bg-[#18171F] border border-[#2E2C37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.sku ? `[${p.sku}] ` : ''}{p.name} (Stock: {p.stock ?? 0})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 space-y-1">
            <label className="text-[11px] font-mono text-[#C5A059] uppercase block">
              Quantity
            </label>
            <input
              type="number"
              min="1"
              max="50"
              value={messengerDeductQty}
              onChange={(e) => setMessengerDeductQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-[#18171F] border border-[#2E2C37] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-3 space-y-1">
            <label className="text-[11px] font-mono text-[#C5A059] uppercase block">
              Order Ref / Customer
            </label>
            <input
              type="text"
              value={messengerOrderRef}
              onChange={(e) => setMessengerOrderRef(e.target.value)}
              placeholder="e.g. MSGR-Tanvir or 0171..."
              className="w-full bg-[#18171F] border border-[#2E2C37] rounded-xl px-3 py-2 text-xs text-white placeholder-[#5C5954] focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <div className="sm:col-span-2">
            <button
              type="submit"
              className="w-full py-2 px-3 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-black font-semibold text-xs transition-colors cursor-pointer"
            >
              Deduct Stock
            </button>
          </div>
        </form>
      </div>

      {/* 5. Google Apps Script 2-Way Live Webhook Setup Card */}
      <div className="bg-[#141318] border border-[#26242E] rounded-2xl p-5 sm:p-6 space-y-4 shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#23222A] pb-3">
          <div>
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-[#D4AF37]" />
              <span>Google Apps Script Live Webhook (Optional 2-Way Background Sync)</span>
            </h4>
            <p className="text-xs text-[#8E8B83]">
              Deploy this 1-click script inside your Google Sheet to automatically sync when cells are edited.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCopyScript}
            className="py-1.5 px-3 rounded-lg bg-[#1D1C24] hover:bg-[#272630] border border-[#312F3D] text-[#D4AF37] text-xs font-mono flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            {copiedScript ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copiedScript ? 'Copied Script!' : 'Copy Apps Script'}</span>
          </button>
        </div>

        {/* Quick Instructions */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs text-[#B3AFA5]">
          <div className="p-3 bg-[#17161C] rounded-xl border border-[#23222A] space-y-1">
            <span className="font-mono text-[#D4AF37] font-bold text-xs">Step 1</span>
            <p>Open "Vellure Fragrances - Inventory" in Google Sheets and click <strong>Extensions &gt; Apps Script</strong>.</p>
          </div>
          <div className="p-3 bg-[#17161C] rounded-xl border border-[#23222A] space-y-1">
            <span className="font-mono text-[#D4AF37] font-bold text-xs">Step 2</span>
            <p>Paste the copied script and click <strong>Deploy &gt; New deployment</strong>.</p>
          </div>
          <div className="p-3 bg-[#17161C] rounded-xl border border-[#23222A] space-y-1">
            <span className="font-mono text-[#D4AF37] font-bold text-xs">Step 3</span>
            <p>Select type <strong>Web app</strong>, access <strong>Anyone</strong>, and click Deploy.</p>
          </div>
          <div className="p-3 bg-[#17161C] rounded-xl border border-[#23222A] space-y-1">
            <span className="font-mono text-[#D4AF37] font-bold text-xs">Step 4</span>
            <p>Paste the resulting Web App URL in the field below for 24/7 background sync.</p>
          </div>
        </div>

        <div className="space-y-1 pt-1">
          <label className="text-[11px] font-mono text-[#C5A059] uppercase block">
            Google Apps Script Web App Webhook URL
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={webhookUrlInput}
              onChange={(e) => setWebhookUrlInput(e.target.value)}
              placeholder="https://script.google.com/macros/s/AKfycbx.../exec"
              className="flex-1 bg-[#18171F] border border-[#2E2C37] rounded-xl px-3.5 py-2 text-xs text-white placeholder-[#5C5954] focus:outline-none focus:border-[#D4AF37]"
            />
            <button
              type="button"
              onClick={handleSaveSettings}
              className="py-2 px-4 rounded-xl bg-[#23222C] hover:bg-[#2E2C38] border border-[#3A3845] text-xs text-white font-medium transition-colors cursor-pointer"
            >
              Save URL
            </button>
          </div>
        </div>
      </div>

      {/* 6. MANDATORY CONFIRMATION MODAL FOR DESTRUCTIVE / MUTATING INVENTORY OPERATIONS */}
      {confirmModalOpen && pendingAction && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17161D] border border-[#D4AF37]/50 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-[#D4AF37] shrink-0">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-white">
                  Confirm Inventory Modification
                </h4>
                <p className="text-xs text-[#A8A49C] leading-relaxed">
                  {pendingAction.description}
                </p>
              </div>
            </div>

            {/* Affected Items Table */}
            <div className="max-h-52 overflow-y-auto rounded-xl bg-[#111014] border border-[#26242E] p-2 divide-y divide-[#1D1C24] text-xs">
              {pendingAction.details.map((item, idx) => (
                <div key={idx} className="py-2 px-2.5 flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-white block">{item.name}</span>
                    <span className="text-[10px] font-mono text-[#D4AF37]">{item.sku || 'No SKU'}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-[#8E8B83]">{item.currentStock}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span className={`font-bold ${item.targetStock <= 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {item.targetStock} {item.targetStock <= 0 ? '(Out of Stock)' : ''}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  setConfirmModalOpen(false);
                  setPendingAction(null);
                }}
                disabled={confirmingAction}
                className="py-2 px-4 rounded-xl bg-[#201F27] hover:bg-[#2B2934] text-xs text-[#B3AFA5] font-medium transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleExecuteConfirmedAction}
                disabled={confirmingAction}
                className="py-2 px-5 rounded-xl bg-[#D4AF37] hover:bg-[#C5A059] text-xs text-black font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {confirmingAction && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                <span>{confirmingAction ? 'Applying Changes...' : 'Confirm & Apply'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

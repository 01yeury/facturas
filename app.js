const SUPABASE_URL = "https://exiedneezuzkdqfeqxlq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4aWVkbmVlenV6a2RxZmVxeGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTAxODAsImV4cCI6MjA4ODU4NjE4MH0.bVV5mlGZURw_H-xw0kVN9dI8jQ4NN9dgPQ9HlN4krEY";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

const state = {
  currentUser: null,
  currentView: "dashboard",
  config: {
    empresa: "JeanSkirt",
    rnc: "",
    itbis: true,
    logo: "",
    theme: "pink"
  },
  invoiceItems: [],
  invoices: [],
  clients: [],
  products: [],
  selectedProductId: null,
  selectedClientId: null,
  selectedInvoice: null,
  selectedInvoiceItems: [],
  editingClientId: null,
  editingProductId: null,
  authReady: false,
  isBootstrapping: false,
  isBindingEvents: false,
  lastSessionUserId: null,
  monthlyInvoiceLimit: 10,
  monthlyInvoiceUsed: 0,
  isPremium: false,
};

const el = {
  usageBanner: document.getElementById("usageBanner"),
  usageBannerText: document.getElementById("usageBannerText"),
  btnGoPremium: document.getElementById("btnGoPremium"),
  facturaBlockedBox: document.getElementById("facturaBlockedBox"),
  loginView: document.getElementById("loginView"),
  appShell: document.getElementById("appShell"),
  authEmail: document.getElementById("authEmail"),
  authPassword: document.getElementById("authPassword"),
  authMessage: document.getElementById("authMessage"),
  btnLogin: document.getElementById("btnLogin"),
  btnRegister: document.getElementById("btnRegister"),
  btnLogout: document.getElementById("btnLogout"),

  headerCompany: document.getElementById("headerCompany"),
  headerTitle: document.getElementById("headerTitle"),
  navItems: document.querySelectorAll(".nav-item"),

  dashboardCompany: document.getElementById("dashboardCompany"),
  statTodaySales: document.getElementById("statTodaySales"),
  statTodayCount: document.getElementById("statTodayCount"),
  statMonthSales: document.getElementById("statMonthSales"),
  dashboardRecentInvoices: document.getElementById("dashboardRecentInvoices"),
  btnGoFactura: document.getElementById("btnGoFactura"),
  btnRefreshDashboard: document.getElementById("btnRefreshDashboard"),

  empresaNombre: document.getElementById("empresaNombre"),
  logoImg: document.getElementById("logoImg"),
  logoSettingsPreview: document.getElementById("logoSettingsPreview"),
  numeroFactura: document.getElementById("numeroFactura"),
  fechaFactura: document.getElementById("fechaFactura"),

  toggleCliente: document.getElementById("toggleCliente"),
  toggleEmpresa: document.getElementById("toggleEmpresa"),
  clienteArea: document.getElementById("clienteArea"),
  clienteNombre: document.getElementById("clienteNombre"),
  clienteSuggestions: document.getElementById("clienteSuggestions"),
  rncMostrar: document.getElementById("rncMostrar"),
  rncTexto: document.getElementById("rncTexto"),
  clienteResumen: document.getElementById("clienteResumen"),

  productoNombre: document.getElementById("productoNombre"),
  productoSuggestions: document.getElementById("productoSuggestions"),
  productoCantidad: document.getElementById("productoCantidad"),
  productoPrecio: document.getElementById("productoPrecio"),
  btnAgregarProducto: document.getElementById("btnAgregarProducto"),
  tablaProductos: document.getElementById("tablaProductos"),
  subtotalFactura: document.getElementById("subtotalFactura"),
  itbisRow: document.getElementById("itbisRow"),
  itbisFactura: document.getElementById("itbisFactura"),
  totalFactura: document.getElementById("totalFactura"),
  btnGuardarFactura: document.getElementById("btnGuardarFactura"),
  btnImprimirFactura: document.getElementById("btnImprimirFactura"),
  facturaMessage: document.getElementById("facturaMessage"),

  historialSearch: document.getElementById("historialSearch"),
  historialList: document.getElementById("historialList"),
  btnRefreshHistorial: document.getElementById("btnRefreshHistorial"),

  clienteNuevoNombre: document.getElementById("clienteNuevoNombre"),
  clienteNuevoRnc: document.getElementById("clienteNuevoRnc"),
  btnGuardarCliente: document.getElementById("btnGuardarCliente"),
  clientesList: document.getElementById("clientesList"),
  clientesMessage: document.getElementById("clientesMessage"),
  btnRefreshClientes: document.getElementById("btnRefreshClientes"),

  btnRefreshProductos: document.getElementById("btnRefreshProductos"),
  productoNuevoNombre: document.getElementById("productoNuevoNombre"),
  productoNuevoPrecio: document.getElementById("productoNuevoPrecio"),
  productoNuevaDescripcion: document.getElementById("productoNuevaDescripcion"),
  btnGuardarProducto: document.getElementById("btnGuardarProducto"),
  productosList: document.getElementById("productosList"),
  productosMessage: document.getElementById("productosMessage"),

  empresaInput: document.getElementById("empresaInput"),
  rncInput: document.getElementById("rncInput"),
  logoInput: document.getElementById("logoInput"),
  dropArea: document.getElementById("dropArea"),
  toggleItbis: document.getElementById("toggleItbis"),
  btnGuardarAjustes: document.getElementById("btnGuardarAjustes"),
  ajustesMessage: document.getElementById("ajustesMessage"),
  btnVolverHistorial: document.getElementById("btnVolverHistorial"),
  detalleInvoiceNumber: document.getElementById("detalleInvoiceNumber"),
  detalleInvoiceDate: document.getElementById("detalleInvoiceDate"),
  detalleClientName: document.getElementById("detalleClientName"),
  detalleClientRnc: document.getElementById("detalleClientRnc"),
  detalleBusinessName: document.getElementById("detalleBusinessName"),
  detalleItemsTable: document.getElementById("detalleItemsTable"),
  detalleSubtotal: document.getElementById("detalleSubtotal"),
  detalleTax: document.getElementById("detalleTax"),
  detalleTotal: document.getElementById("detalleTotal"),
  btnImprimirDetalle: document.getElementById("btnImprimirDetalle"),
  clientEditModal: document.getElementById("clientEditModal"),
  editClientName: document.getElementById("editClientName"),
  editClientRnc: document.getElementById("editClientRnc"),
  editClientEmail: document.getElementById("editClientEmail"),
  editClientPhone: document.getElementById("editClientPhone"),
  editClientAddress: document.getElementById("editClientAddress"),
  editClientNotes: document.getElementById("editClientNotes"),
  btnSaveClientEdit: document.getElementById("btnSaveClientEdit"),
  btnCloseClientEdit: document.getElementById("btnCloseClientEdit"),
  productEditModal: document.getElementById("productEditModal"),
  editProductName: document.getElementById("editProductName"),
  editProductDescription: document.getElementById("editProductDescription"),
  editProductPrice: document.getElementById("editProductPrice"),
  toggleEditProductActive: document.getElementById("toggleEditProductActive"),
  btnSaveProductEdit: document.getElementById("btnSaveProductEdit"),
  btnCloseProductEdit: document.getElementById("btnCloseProductEdit"),
  btnOpenMoreMenu: document.getElementById("btnOpenMoreMenu"),
  btnBottomMore: document.getElementById("btnBottomMore"),
  moreDrawer: document.getElementById("moreDrawer"),
  moreDrawerItems: document.querySelectorAll("[data-more-view]"),
  clienteRncManual: document.getElementById("clienteRncManual"),
  themePicker: document.getElementById("themePicker"),
  themeSwatches: document.querySelectorAll(".theme-swatch")
};

const viewTitles = {
  dashboard: "Inicio",
  factura: "Facturar",
  historial: "Historial",
  clientes: "Clientes",
  productos: "Productos",
  ajustes: "Ajustes",
  "factura-detalle": "Detalle de factura"
};

const themeMap = {
  pink: {
    primary: "#e8a4bb",
    primaryDark: "#d98aa5",
    primarySoft: "#fbe8ee",
    focusRing: "rgba(232,164,187,0.18)"
  },
  blue: {
    primary: "#9fc4ef",
    primaryDark: "#79aee4",
    primarySoft: "#eaf3fd",
    focusRing: "rgba(159,196,239,0.20)"
  },
  lilac: {
    primary: "#bea5ec",
    primaryDark: "#a487e3",
    primarySoft: "#f2edfc",
    focusRing: "rgba(190,165,236,0.20)"
  },
  mint: {
    primary: "#97d8b6",
    primaryDark: "#74c79a",
    primarySoft: "#eaf8f0",
    focusRing: "rgba(151,216,182,0.20)"
  },
  peach: {
    primary: "#ecbb95",
    primaryDark: "#e1a97b",
    primarySoft: "#fcf1e8",
    focusRing: "rgba(236,187,149,0.22)"
  }
};

function applyTheme(themeName = "pink") {
  const theme = themeMap[themeName] || themeMap.pink;

  document.documentElement.style.setProperty("--primary", theme.primary);
  document.documentElement.style.setProperty("--primary-dark", theme.primaryDark);
  document.documentElement.style.setProperty("--primary-soft", theme.primarySoft);
  document.documentElement.style.setProperty("--focus-ring", theme.focusRing);

  state.config.theme = themeMap[themeName] ? themeName : "pink";
  updateThemePickerUI();
}

function updateThemePickerUI() {
  if (!el.themeSwatches) return;

  el.themeSwatches.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.theme === state.config.theme);
  });
}

function money(value) {
  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function setStatus(target, text, isError = false) {
  if (!target) return;
  target.textContent = text || "";
  target.style.color = isError ? "#b42318" : "#6b7280";
}

function setToggle(button, active) {
  if (!button) return;
  button.classList.toggle("active", !!active);
  button.setAttribute("aria-pressed", active ? "true" : "false");
}

function toggleButton(button) {
  if (!button) return false;
  const active = !button.classList.contains("active");
  setToggle(button, active);
  return active;
}

function showLoginView(message = "") {
  state.currentUser = null;
  state.lastSessionUserId = null;

  if (el.appShell) el.appShell.classList.add("hidden");
  if (el.loginView) el.loginView.classList.remove("hidden");
  if (message) setStatus(el.authMessage, message);
}

function showAppView() {
  if (el.loginView) el.loginView.classList.add("hidden");
  if (el.appShell) el.appShell.classList.remove("hidden");
}

function resetInvoiceMeta() {
  const now = new Date();
  if (el.numeroFactura) el.numeroFactura.textContent = `JS-${now.getTime()}`;
  if (el.fechaFactura) el.fechaFactura.textContent = now.toLocaleDateString("es-DO");
}

function showView(viewName) {
  state.currentView = viewName;

  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("active", view.id === `view-${viewName}`);
  });

  el.navItems.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  if (el.headerTitle) {
    el.headerTitle.textContent = viewTitles[viewName] || "Inicio";
  }

  closeMoreDrawer();
}

function updateHeaderCompany() {
  const company = state.config.empresa || "JeanSkirt";
  if (el.headerCompany) el.headerCompany.textContent = company;
  if (el.dashboardCompany) el.dashboardCompany.textContent = company;
  if (el.empresaNombre) el.empresaNombre.textContent = company;
  if (el.detalleBusinessName && !state.selectedInvoice) {
    el.detalleBusinessName.textContent = company;
  }
}

function updateLogo() {
  const logo = state.config.logo || "";
  if (el.logoImg) el.logoImg.src = logo;
  if (el.logoSettingsPreview) el.logoSettingsPreview.src = logo;
}

function getCurrentClientRnc() {
  if (!el.toggleEmpresa || !el.toggleEmpresa.classList.contains("active")) return "";

  const selectedClient = state.clients.find(
    client => String(client.id) === String(state.selectedClientId)
  );

  if (selectedClient && selectedClient.rnc) {
    return selectedClient.rnc;
  }

  return el.clienteRncManual ? el.clienteRncManual.value.trim() : "";
}

function updateInvoiceActionButtons() {
  const hasItems = state.invoiceItems.length > 0;

  if (el.btnGuardarFactura) {
    el.btnGuardarFactura.disabled = !hasItems;
  }

  if (el.btnImprimirFactura) {
    el.btnImprimirFactura.disabled = !hasItems;
  }
}

function updateClientSummary() {
  if (!el.toggleCliente || !el.clienteResumen || !el.clienteNombre) return;

  const clienteActivo = el.toggleCliente.classList.contains("active");
  const empresaActiva = el.toggleEmpresa && el.toggleEmpresa.classList.contains("active");
  const nombre = el.clienteNombre.value.trim();

  if (!clienteActivo || !nombre) {
    el.clienteResumen.classList.add("hidden");
    el.clienteResumen.innerHTML = "";
    return;
  }

  const clientRnc = getCurrentClientRnc();

  if (empresaActiva) {
    el.clienteResumen.innerHTML = `<strong>Cliente:</strong> ${nombre}<br><strong>RNC:</strong> ${clientRnc || ""}`;
  } else {
    el.clienteResumen.innerHTML = `<strong>Cliente:</strong> ${nombre}`;
  }

  el.clienteResumen.classList.remove("hidden");
}

function getCurrentMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);

  return {
    startISO: start.toISOString(),
    endISO: end.toISOString()
  };
}

async function loadMonthlyInvoiceUsage() {
  if (!state.currentUser || state.isPremium) {
    state.monthlyInvoiceUsed = 0;
    return;
  }

  const { startISO, endISO } = getCurrentMonthRange();

  const { count, error } = await supabaseClient
    .from("invoices")
    .select("*", { count: "exact", head: true })
    .eq("user_id", state.currentUser.id)
    .gte("created_at", startISO)
    .lt("created_at", endISO);

  if (error) {
    console.error("loadMonthlyInvoiceUsage error:", error);
    state.monthlyInvoiceUsed = 0;
    return;
  }

  state.monthlyInvoiceUsed = count || 0;
}

function getRemainingInvoicesThisMonth() {
  if (state.isPremium) return Infinity;
  return Math.max(0, state.monthlyInvoiceLimit - state.monthlyInvoiceUsed);
}

function hasReachedMonthlyLimit() {
  if (state.isPremium) return false;
  return state.monthlyInvoiceUsed >= state.monthlyInvoiceLimit;
}

function updateUsageBanner() {
  if (!el.usageBanner || !el.usageBannerText) return;

  if (state.isPremium) {
    el.usageBanner.classList.remove("hidden");
    el.usageBanner.classList.add("premium");
    el.usageBanner.classList.remove("limit-reached");
    el.usageBannerText.textContent = "Eres Premium. Facturación ilimitada activa.";
    return;
  }

  const remaining = getRemainingInvoicesThisMonth();

  el.usageBanner.classList.remove("hidden");
  el.usageBanner.classList.remove("premium");

  if (remaining <= 0) {
    el.usageBanner.classList.add("limit-reached");
    el.usageBannerText.textContent = "Ya usaste tus 10 facturas de este mes. Hazte Premium para seguir.";
  } else {
    el.usageBanner.classList.remove("limit-reached");
    el.usageBannerText.textContent = `Te quedan ${remaining} factura${remaining === 1 ? "" : "s"} este mes.`;
  }
}

function updateFacturaAvailability() {
  const blocked = hasReachedMonthlyLimit();

  if (el.facturaBlockedBox) {
    el.facturaBlockedBox.classList.toggle("hidden", !blocked);
  }

  const facturaCard = document.querySelector("#view-factura .section-card");
  if (facturaCard) {
    facturaCard.classList.toggle("factura-disabled", blocked);
  }

  if (el.btnGoFactura) {
    el.btnGoFactura.disabled = blocked;
  }

  if (el.btnAgregarProducto) {
    el.btnAgregarProducto.disabled = blocked;
  }

  const facturaInputs = document.querySelectorAll(
    '#view-factura input, #view-factura select, #view-factura textarea, #view-factura .toggle-switch'
  );

  facturaInputs.forEach(node => {
    if (node.classList.contains("toggle-switch")) {
      node.style.pointerEvents = blocked ? "none" : "";
      node.style.opacity = blocked ? "0.6" : "";
    } else {
      node.disabled = blocked;
    }
  });

  el.productoSuggestions?.classList.add("hidden");
  el.clienteSuggestions?.classList.add("hidden");

  updateInvoiceActionButtons();
}

function updateInvoiceActionButtons() {
  const hasItems = state.invoiceItems.length > 0;
  const blocked = hasReachedMonthlyLimit();

  if (el.btnGuardarFactura) {
    el.btnGuardarFactura.disabled = blocked || !hasItems;
  }

  if (el.btnImprimirFactura) {
    el.btnImprimirFactura.disabled = blocked || !hasItems;
  }
}

function openMoreDrawer() {
  if (!el.moreDrawer) return;
  el.moreDrawer.classList.remove("hidden");
}

function closeMoreDrawer() {
  if (!el.moreDrawer) return;
  el.moreDrawer.classList.add("hidden");
}

function renderInvoiceTable() {
  if (!el.tablaProductos) return;

  if (!state.invoiceItems.length) {
    el.tablaProductos.innerHTML = `
      <tr>
        <td colspan="5" class="empty-cell">No hay productos agregados.</td>
      </tr>
    `;
    updateInvoiceActionButtons();
    return;
  }

  el.tablaProductos.innerHTML = state.invoiceItems.map((item, index) => `
    <tr>
      <td data-label="Producto">${item.nombre}</td>
      <td data-label="Cant." class="right">${item.cantidad}</td>
      <td data-label="Precio" class="right">${money(item.precio)}</td>
      <td data-label="Total" class="right">${money(item.total)}</td>
      <td data-label="Acción" class="right">
        <button type="button" class="btn-remove" data-remove-index="${index}">
          Quitar
        </button>
      </td>
    </tr>
  `).join("");

  updateInvoiceActionButtons();
}

function recalculateInvoice() {
  if (!el.totalFactura) return;

  const total = state.invoiceItems.reduce((acc, item) => acc + item.total, 0);

  if (state.config.itbis) {
    const subtotal = total / 1.18;
    const itbis = total - subtotal;

    if (el.subtotalFactura) el.subtotalFactura.textContent = money(subtotal);
    if (el.itbisFactura) el.itbisFactura.textContent = money(itbis);
    if (el.itbisRow) el.itbisRow.style.display = "";
  } else {
    if (el.subtotalFactura) el.subtotalFactura.textContent = money(total);
    if (el.itbisFactura) el.itbisFactura.textContent = money(0);
    if (el.itbisRow) el.itbisRow.style.display = "none";
  }

  el.totalFactura.textContent = money(total);
}

function clearInvoiceForm() {
  state.invoiceItems = [];
  state.selectedClientId = null;
  state.selectedProductId = null;

  renderInvoiceTable();
  recalculateInvoice();
  setStatus(el.facturaMessage, "");
  resetInvoiceMeta();

  if (el.clienteNombre) el.clienteNombre.value = "";
  if (el.productoNombre) el.productoNombre.value = "";
  if (el.productoCantidad) el.productoCantidad.value = "";
  if (el.productoPrecio) el.productoPrecio.value = "";

  setToggle(el.toggleCliente, false);
  setToggle(el.toggleEmpresa, false);

  if (el.clienteArea) el.clienteArea.classList.add("hidden");
  if (el.rncMostrar) el.rncMostrar.classList.add("hidden");
  if (el.clienteSuggestions) el.clienteSuggestions.classList.add("hidden");
  if (el.productoSuggestions) el.productoSuggestions.classList.add("hidden");

  if (el.clienteRncManual) {
    el.clienteRncManual.value = "";
    el.clienteRncManual.classList.add("hidden");
  }

  if (el.rncTexto) el.rncTexto.textContent = "";

  updateClientSummary();
  updateInvoiceActionButtons();
}

function applyProfileToUI() {
  updateHeaderCompany();
  updateLogo();

  if (el.empresaInput) el.empresaInput.value = state.config.empresa || "JeanSkirt";
  if (el.rncInput) el.rncInput.value = state.config.rnc || "";
  if (el.rncTexto) el.rncTexto.textContent = state.config.rnc || "";

  setToggle(el.toggleItbis, !!state.config.itbis);

  applyTheme(state.config.theme || "pink");

  updateClientSummary();
  recalculateInvoice();
}

async function ensureProfile(user) {
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const defaultProfile = {
    id: user.id,
    email: user.email
  };

  const { error: insertError } = await supabaseClient
    .from("profiles")
    .insert(defaultProfile);

  if (insertError) throw insertError;
  return defaultProfile;
}

async function ensureBusinessSettings(user) {
  const { data, error } = await supabaseClient
    .from("business_settings")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  if (data) return data;

  const defaultSettings = {
    user_id: user.id,
    business_name: "JeanSkirt",
    business_logo: "",
    business_rnc: "",
    phone: "",
    address: "",
    default_currency: "DOP",
    use_default_itbis: true,
    is_premium: false
  };

  const { error: insertError } = await supabaseClient
    .from("business_settings")
    .insert(defaultSettings);

  if (insertError) throw insertError;
  return defaultSettings;
}

async function loadProfileFromSession(session) {
  if (!session?.user) return false;

  state.currentUser = session.user;

  await ensureProfile(state.currentUser);
  const business = await ensureBusinessSettings(state.currentUser);

  state.config = {
    empresa: business.business_name || "JeanSkirt",
    rnc: business.business_rnc || "",
    itbis: typeof business.use_default_itbis === "boolean"
      ? business.use_default_itbis
      : true,
    logo: business.business_logo || "",
    theme: business.theme || "pink"
  };

  state.isPremium = !!business.is_premium;
  applyProfileToUI();
  return true;
}

async function registerUser() {
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value.trim();

  if (!email || !password) {
    setStatus(el.authMessage, "Completa correo y contraseña.", true);
    return;
  }

  const { error } = await supabaseClient.auth.signUp({ email, password });

  if (error) {
    setStatus(el.authMessage, error.message, true);
    return;
  }

  setStatus(el.authMessage, "Cuenta creada. Revisa tu correo si se requiere confirmación.");
}

async function loginUser() {
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value.trim();

  if (!email || !password) {
    setStatus(el.authMessage, "Completa correo y contraseña.", true);
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (error) {
    setStatus(el.authMessage, error.message, true);
    return;
  }

  setStatus(el.authMessage, "Sesión iniciada.");
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
  showLoginView("Sesión cerrada.");
}

function addInvoiceItem() {
  const nombre = el.productoNombre.value.trim();
  const cantidad = parseFloat(el.productoCantidad.value);
  const precio = parseFloat(el.productoPrecio.value);

  if (!nombre || isNaN(cantidad) || isNaN(precio) || cantidad <= 0 || precio < 0) {
    setStatus(el.facturaMessage, "Completa producto, cantidad y precio correctamente.", true);
    return;
  }

  state.invoiceItems.push({
    product_id: state.selectedProductId || null,
    nombre,
    cantidad,
    precio,
    total: cantidad * precio
  });

  renderInvoiceTable();
  recalculateInvoice();

  el.productoNombre.value = "";
  el.productoCantidad.value = "";
  el.productoPrecio.value = "";
  document.activeElement?.blur();
  
  document.querySelector(".table-wrap")?.scrollIntoView({
    behavior: "smooth",
    block: "start"
  });
  state.selectedProductId = null;

  if (el.productoSuggestions) el.productoSuggestions.classList.add("hidden");

  setStatus(el.facturaMessage, "");
}
async function saveSettings() {
  if (!state.currentUser) return;

  state.config.empresa = el.empresaInput.value.trim() || "JeanSkirt";
  state.config.rnc = el.rncInput.value.trim();
  state.config.itbis = el.toggleItbis.classList.contains("active");

  const payload = {
    user_id: state.currentUser.id,
    business_name: state.config.empresa,
    business_rnc: state.config.rnc,
    business_logo: state.config.logo || "",
    use_default_itbis: state.config.itbis,
    theme: state.config.theme || "pink"
  };

  const { error } = await supabaseClient
    .from("business_settings")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    setStatus(el.ajustesMessage, error.message, true);
    return;
  }

  applyProfileToUI();
  setStatus(el.ajustesMessage, "Ajustes guardados.");
}

function removeInvoiceItem(index) {
  state.invoiceItems.splice(index, 1);
  renderInvoiceTable();
  recalculateInvoice();
}

async function saveInvoice() {

  if (hasReachedMonthlyLimit()) {
    setStatus(
      el.facturaMessage,
      "Ya alcanzaste tu límite mensual de 10 facturas. Hazte Premium para seguir.",
      true
    );
    updateUsageBanner();
    updateFacturaAvailability();
    return;
  }
  
  if (!state.currentUser) return;

  if (!state.invoiceItems.length) {
    setStatus(el.facturaMessage, "Agrega al menos un producto.", true);
    return;
  }

  const total = state.invoiceItems.reduce((acc, item) => acc + item.total, 0);
  const subtotal = state.config.itbis ? +(total / 1.18).toFixed(2) : +total.toFixed(2);
  const taxTotal = state.config.itbis ? +(total - subtotal).toFixed(2) : 0;

  const cliente = el.toggleCliente.classList.contains("active")
    ? el.clienteNombre.value.trim()
    : "";

  const esEmpresa = el.toggleEmpresa.classList.contains("active");

  const invoicePayload = {
    user_id: state.currentUser.id,
    client_id: state.selectedClientId || null,
    client_name: cliente || null,
    client_rnc: esEmpresa ? (getCurrentClientRnc() || null) : null,
    client_email: null,
    business_name: state.config.empresa || null,
    business_rnc: state.config.rnc || null,
    subtotal,
    tax_total: taxTotal,
    total: +total.toFixed(2),
    currency: "DOP",
    invoice_number: el.numeroFactura.textContent
  };

  const { data: invoiceData, error: invoiceError } = await supabaseClient
    .from("invoices")
    .insert(invoicePayload)
    .select()
    .single();

  if (invoiceError) {
    setStatus(el.facturaMessage, invoiceError.message, true);
    return;
  }

  const itemsPayload = state.invoiceItems.map(item => ({
    invoice_id: invoiceData.id,
    product_id: item.product_id || null,
    description: item.nombre,
    quantity: item.cantidad,
    unit_price: item.precio,
    tax_rate: state.config.itbis ? 0.18 : 0,
    line_total: item.total
  }));

  const { error: itemsError } = await supabaseClient
    .from("invoice_items")
    .insert(itemsPayload);

  if (itemsError) {
    setStatus(el.facturaMessage, itemsError.message, true);
    return;
  }

  setStatus(el.facturaMessage, "Factura guardada correctamente.");
  await loadInvoices();
  await loadMonthlyInvoiceUsage();
  renderDashboard();
  renderHistorial();
  updateUsageBanner();
  clearInvoiceForm();
  updateFacturaAvailability();
}

async function loadInvoices() {
  if (!state.currentUser) return;

  const { data, error } = await supabaseClient
    .from("invoices")
    .select("*")
    .eq("user_id", state.currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    state.invoices = [];
    return;
  }

  state.invoices = data || [];
}

async function loadInvoiceItems(invoiceId) {
  const { data, error } = await supabaseClient
    .from("invoice_items")
    .select("*")
    .eq("invoice_id", invoiceId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error(error);
    state.selectedInvoiceItems = [];
    return;
  }

  state.selectedInvoiceItems = data || [];
}

function renderInvoiceDetail() {
  const invoice = state.selectedInvoice;
  const items = state.selectedInvoiceItems;

  if (!invoice) return;

  el.detalleInvoiceNumber.textContent = invoice.invoice_number || "Sin número";
  el.detalleInvoiceDate.textContent = invoice.created_at
    ? new Date(invoice.created_at).toLocaleDateString("es-DO")
    : "";
  el.detalleClientName.textContent = invoice.client_name || "Sin cliente";
  el.detalleClientRnc.textContent = invoice.client_rnc || "Sin RNC";
  el.detalleBusinessName.textContent = invoice.business_name || state.config.empresa || "";

  if (!items.length) {
    el.detalleItemsTable.innerHTML = '<tr><td colspan="4" class="empty-cell">No hay items.</td></tr>';
  } else {
    el.detalleItemsTable.innerHTML = items.map(item => `
      <tr>
        <td>${item.description || ""}</td>
        <td class="right">${item.quantity || 0}</td>
        <td class="right">${money(item.unit_price || 0)}</td>
        <td class="right">${money(item.line_total || 0)}</td>
      </tr>
    `).join("");
  }

  el.detalleSubtotal.textContent = money(invoice.subtotal || 0);
  el.detalleTax.textContent = money(invoice.tax_total || 0);
  el.detalleTotal.textContent = money(invoice.total || 0);
}

async function openInvoiceDetail(invoiceId) {
  const invoice = state.invoices.find(i => String(i.id) === String(invoiceId));
  if (!invoice) return;

  state.selectedInvoice = invoice;
  await loadInvoiceItems(invoice.id);
  renderInvoiceDetail();
  showView("factura-detalle");
}

function renderDashboard() {
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const monthKey = today.toISOString().slice(0, 7);

  const todayInvoices = state.invoices.filter(
    item => String(item.created_at || "").slice(0, 10) === todayKey
  );
  const monthInvoices = state.invoices.filter(
    item => String(item.created_at || "").slice(0, 7) === monthKey
  );

  const todaySales = todayInvoices.reduce((sum, item) => sum + Number(item.total || 0), 0);
  const monthSales = monthInvoices.reduce((sum, item) => sum + Number(item.total || 0), 0);

  el.statTodaySales.textContent = money(todaySales);
  el.statTodayCount.textContent = String(todayInvoices.length);
  el.statMonthSales.textContent = money(monthSales);

  if (!state.invoices.length) {
    el.dashboardRecentInvoices.innerHTML = "Aún no hay facturas.";
    el.dashboardRecentInvoices.classList.add("empty-state");
    return;
  }

  el.dashboardRecentInvoices.classList.remove("empty-state");
  el.dashboardRecentInvoices.innerHTML = state.invoices.slice(0, 3).map(invoice => `
    <div class="list-item">
      <div class="list-title">${invoice.invoice_number || "Sin número"} - ${money(invoice.total)}</div>
      <div class="list-meta">${invoice.client_name || "Sin cliente"} • ${new Date(invoice.created_at).toLocaleDateString("es-DO")}</div>
    </div>
  `).join("");
}

function renderHistorial() {
  const query = el.historialSearch.value.trim().toLowerCase();

  const filtered = state.invoices.filter(invoice => {
    const numero = String(invoice.invoice_number || "").toLowerCase();
    const cliente = String(invoice.client_name || "").toLowerCase();
    return numero.includes(query) || cliente.includes(query);
  });

  if (!filtered.length) {
    el.historialList.innerHTML = "No hay facturas registradas.";
    el.historialList.classList.add("empty-state");
    return;
  }

  el.historialList.classList.remove("empty-state");
  el.historialList.innerHTML = filtered.map(invoice => `
    <div class="list-item invoice-history-item" style="cursor:pointer" data-invoice-id="${invoice.id}">
      <div class="list-title">${invoice.invoice_number || "Sin número"} - ${money(invoice.total)}</div>
      <div class="list-meta">
        ${invoice.client_name || "Sin cliente"} • ${new Date(invoice.created_at).toLocaleDateString("es-DO")}
        ${invoice.client_rnc ? ` • RNC ${invoice.client_rnc}` : ""}
      </div>
    </div>
  `).join("");
}
async function saveClient() {
  if (!state.currentUser) return;

  const nombre = el.clienteNuevoNombre.value.trim();
  const rnc = el.clienteNuevoRnc.value.trim();

  if (!nombre) {
    setStatus(el.clientesMessage, "Escribe el nombre del cliente.", true);
    return;
  }

  const { error } = await supabaseClient
    .from("clients")
    .insert({
      user_id: state.currentUser.id,
      name: nombre,
      rnc: rnc || null
    });

  if (error) {
    setStatus(el.clientesMessage, error.message, true);
    return;
  }

  setStatus(el.clientesMessage, "Cliente guardado.");
  el.clienteNuevoNombre.value = "";
  el.clienteNuevoRnc.value = "";

  await loadClients();
  renderClients();
}

async function loadClients() {
  if (!state.currentUser) return;

  const { data, error } = await supabaseClient
    .from("clients")
    .select("*")
    .eq("user_id", state.currentUser.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    state.clients = [];
    return;
  }

  state.clients = data || [];
}

function renderClients() {
  if (!state.clients.length) {
    el.clientesList.innerHTML = "No hay clientes guardados.";
    el.clientesList.classList.add("empty-state");
    return;
  }

  el.clientesList.classList.remove("empty-state");
  el.clientesList.innerHTML = state.clients.map(client => `
    <div class="list-item client-list-item" style="cursor:pointer" data-client-id="${client.id}">
      <div class="list-title">${client.name}</div>
      <div class="list-meta">${client.rnc || "Sin RNC"}</div>
    </div>
  `).join("");
}

async function saveProduct() {
  if (!state.currentUser) return;

  const name = el.productoNuevoNombre.value.trim();
  const price = parseFloat(el.productoNuevoPrecio.value);
  const description = el.productoNuevaDescripcion.value.trim();

  if (!name || isNaN(price) || price < 0) {
    setStatus(el.productosMessage, "Escribe nombre y precio válidos.", true);
    return;
  }

  const { error } = await supabaseClient
    .from("products")
    .insert({
      user_id: state.currentUser.id,
      name,
      description: description || null,
      price,
      tax_id: null,
      is_active: true
    });

  if (error) {
    setStatus(el.productosMessage, error.message, true);
    return;
  }

  setStatus(el.productosMessage, "Producto guardado.");
  el.productoNuevoNombre.value = "";
  el.productoNuevoPrecio.value = "";
  el.productoNuevaDescripcion.value = "";

  await loadProducts();
  renderProducts();
}

async function loadProducts() {
  if (!state.currentUser) return;

  const { data, error } = await supabaseClient
    .from("products")
    .select("*")
    .eq("user_id", state.currentUser.id)
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    state.products = [];
    return;
  }

  state.products = data || [];
}

function renderProducts() {
  const activeProducts = state.products.filter(product => product.is_active !== false);

  if (!activeProducts.length) {
    el.productosList.innerHTML = "No hay productos guardados.";
    el.productosList.classList.add("empty-state");
    return;
  }

  el.productosList.classList.remove("empty-state");
  el.productosList.innerHTML = activeProducts.map(product => `
    <div class="list-item product-list-item" style="cursor:pointer" data-product-id="${product.id}">
      <div class="list-title">${product.name}</div>
      <div class="list-meta">
        ${money(product.price)}
        ${product.description ? ` • ${product.description}` : ""}
      </div>
    </div>
  `).join("");
}

function buildPrintHTML({ invoice, items }) {
  const clienteHTML = invoice.client_name
    ? `<div class="print-meta"><strong>Cliente:</strong> ${invoice.client_name}</div>`
    : "";

  const clienteRncHTML = invoice.client_rnc
    ? `<div class="print-meta"><strong>RNC cliente:</strong> ${invoice.client_rnc}</div>`
    : "";

  return `
    <div class="print-sheet">
      <div class="print-header">
        ${state.config.logo ? `<img src="${state.config.logo}" alt="Logo" class="print-logo">` : ""}
        <div class="print-business">${invoice.business_name || state.config.empresa || "Empresa"}</div>
        <div class="print-meta"><strong>RNC:</strong> ${invoice.business_rnc || state.config.rnc || ""}</div>
        <div class="print-meta"><strong>Factura No.:</strong> ${invoice.invoice_number || ""}</div>
      </div>

      <div class="print-client">
        ${clienteHTML}
        ${clienteRncHTML}
      </div>

      <table class="print-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th class="right">Cant.</th>
            <th class="right">P. Unit</th>
            <th class="right">Total</th>
          </tr>
        </thead>
        <tbody>
          ${items.map(item => `
            <tr>
              <td>${item.description || item.nombre || ""}</td>
              <td class="right">${item.quantity ?? item.cantidad ?? 0}</td>
              <td class="right">${money(item.unit_price ?? item.precio ?? 0)}</td>
              <td class="right">${money(item.line_total ?? item.total ?? 0)}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>

      <div class="print-totals">
        <div class="print-total-row">
          <span>Subtotal</span>
          <strong>${money(invoice.subtotal || 0)}</strong>
        </div>
        <div class="print-total-row">
          <span>ITBIS</span>
          <strong>${money(invoice.tax_total || 0)}</strong>
        </div>
        <div class="print-total-row print-total-final">
          <span>Total</span>
          <strong>${money(invoice.total || 0)}</strong>
        </div>
      </div>
    </div>
  `;
}

function printInvoiceData(invoice, items) {
  const printContainer = document.getElementById("printContainer");
  if (!printContainer) return;

  printContainer.innerHTML = buildPrintHTML({ invoice, items });
  printContainer.classList.remove("hidden");

  window.print();

  setTimeout(() => {
    printContainer.innerHTML = "";
    printContainer.classList.add("hidden");
  }, 300);
}

function openClientEdit(clientId) {
  const client = state.clients.find(c => String(c.id) === String(clientId));
  if (!client) return;

  state.editingClientId = client.id;
  el.editClientName.value = client.name || "";
  el.editClientRnc.value = client.rnc || "";
  el.editClientEmail.value = client.email || "";
  el.editClientPhone.value = client.phone || "";
  el.editClientAddress.value = client.address || "";
  el.editClientNotes.value = client.notes || "";

  el.clientEditModal.classList.remove("hidden");
}

function closeClientEdit() {
  state.editingClientId = null;
  el.clientEditModal.classList.add("hidden");
}

async function saveClientEdit() {
  if (!state.editingClientId) return;

  const payload = {
    name: el.editClientName.value.trim(),
    rnc: el.editClientRnc.value.trim() || null,
    email: el.editClientEmail.value.trim() || null,
    phone: el.editClientPhone.value.trim() || null,
    address: el.editClientAddress.value.trim() || null,
    notes: el.editClientNotes.value.trim() || null
  };

  const { error } = await supabaseClient
    .from("clients")
    .update(payload)
    .eq("id", state.editingClientId)
    .eq("user_id", state.currentUser.id);

  if (error) {
    setStatus(el.clientesMessage, error.message, true);
    return;
  }

  closeClientEdit();
  await loadClients();
  renderClients();
  setStatus(el.clientesMessage, "Cliente actualizado.");
}

function openProductEdit(productId) {
  const product = state.products.find(p => String(p.id) === String(productId));
  if (!product) return;

  state.editingProductId = product.id;
  el.editProductName.value = product.name || "";
  el.editProductDescription.value = product.description || "";
  el.editProductPrice.value = product.price ?? "";
  setToggle(el.toggleEditProductActive, product.is_active !== false);

  el.productEditModal.classList.remove("hidden");
}

function closeProductEdit() {
  state.editingProductId = null;
  el.productEditModal.classList.add("hidden");
}

async function saveProductEdit() {
  if (!state.editingProductId) return;

  const payload = {
    name: el.editProductName.value.trim(),
    description: el.editProductDescription.value.trim() || null,
    price: parseFloat(el.editProductPrice.value) || 0,
    is_active: el.toggleEditProductActive.classList.contains("active")
  };

  const { error } = await supabaseClient
    .from("products")
    .update(payload)
    .eq("id", state.editingProductId)
    .eq("user_id", state.currentUser.id);

  if (error) {
    setStatus(el.productosMessage, error.message, true);
    return;
  }

  closeProductEdit();
  await loadProducts();
  renderProducts();
  setStatus(el.productosMessage, "Producto actualizado.");
}
function renderProductSuggestions(filter = "") {
  if (!el.productoSuggestions) return;

  const q = filter.trim().toLowerCase();
  const filtered = state.products.filter(product =>
    product.is_active !== false && (
      !q ||
      String(product.name || "").toLowerCase().includes(q) ||
      String(product.description || "").toLowerCase().includes(q)
    )
  );

  if (!filtered.length) {
    el.productoSuggestions.innerHTML = "";
    el.productoSuggestions.classList.add("hidden");
    return;
  }

  el.productoSuggestions.innerHTML = filtered.map(product => `
    <div class="autocomplete-item" data-product-id="${product.id}">
      <div class="autocomplete-title">${product.name}</div>
      <div class="autocomplete-meta">
        ${money(product.price)}
        ${product.description ? ` • ${product.description}` : ""}
      </div>
    </div>
  `).join("");

  el.productoSuggestions.classList.remove("hidden");
}

function renderClientSuggestions(filter = "") {
  if (!el.clienteSuggestions) return;

  const q = filter.trim().toLowerCase();
  const filtered = state.clients.filter(client =>
    !q ||
    String(client.name || "").toLowerCase().includes(q) ||
    String(client.rnc || "").toLowerCase().includes(q) ||
    String(client.email || "").toLowerCase().includes(q)
  );

  if (!filtered.length) {
    el.clienteSuggestions.innerHTML = "";
    el.clienteSuggestions.classList.add("hidden");
    return;
  }

  el.clienteSuggestions.innerHTML = filtered.map(client => `
    <div class="autocomplete-item" data-client-id="${client.id}">
      <div class="autocomplete-title">${client.name}</div>
      <div class="autocomplete-meta">
        ${client.rnc || "Sin RNC"}
        ${client.email ? ` • ${client.email}` : ""}
      </div>
    </div>
  `).join("");

  el.clienteSuggestions.classList.remove("hidden");
}

function selectProduct(productId) {
  const product = state.products.find(p => String(p.id) === String(productId));
  if (!product) return;

  state.selectedProductId = product.id;
  el.productoNombre.value = product.name || "";
  el.productoPrecio.value = product.price ?? "";

  if (!el.productoCantidad.value) {
    el.productoCantidad.value = 1;
  }

  el.productoSuggestions.classList.add("hidden");
}

function selectClient(clientId) {
  const client = state.clients.find(c => String(c.id) === String(clientId));
  if (!client) return;

  state.selectedClientId = client.id;
  el.clienteNombre.value = client.name || "";

  setToggle(el.toggleCliente, true);
  el.clienteArea.classList.remove("hidden");

  if (client.rnc) {
    setToggle(el.toggleEmpresa, true);
    el.rncMostrar.classList.remove("hidden");
    el.rncTexto.textContent = client.rnc;
    el.clienteRncManual.classList.add("hidden");
    el.clienteRncManual.value = "";
  } else {
    setToggle(el.toggleEmpresa, false);
    el.rncMostrar.classList.add("hidden");
    el.rncTexto.textContent = "";
    el.clienteRncManual.classList.add("hidden");
    el.clienteRncManual.value = "";
  }

  el.clienteSuggestions.classList.add("hidden");
  updateClientSummary();
}

function bindLogoUpload() {
  if (!el.logoInput || !el.dropArea) return;

  el.logoInput.addEventListener("change", event => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      state.config.logo = reader.result;
      updateLogo();
    };
    reader.readAsDataURL(file);
  });

  el.dropArea.addEventListener("dragover", event => event.preventDefault());

  el.dropArea.addEventListener("drop", event => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      state.config.logo = reader.result;
      updateLogo();
    };
    reader.readAsDataURL(file);
  });
}

function bindEvents() {

  if (el.themeSwatches) {
    el.themeSwatches.forEach(btn => {
      btn.addEventListener("click", () => {
        applyTheme(btn.dataset.theme);
      });
    });
  }
  
  if (state.isBindingEvents) return;
  state.isBindingEvents = true;

  if (el.btnLogin) el.btnLogin.addEventListener("click", loginUser);
  if (el.btnRegister) el.btnRegister.addEventListener("click", registerUser);
  if (el.btnLogout) el.btnLogout.addEventListener("click", logoutUser);

  el.navItems.forEach(btn => {
    btn.addEventListener("click", () => showView(btn.dataset.view));
  });

  if (el.btnGoFactura) {
    el.btnGoFactura.addEventListener("click", () => showView("factura"));
  }

  if (el.btnRefreshDashboard) {
    el.btnRefreshDashboard.addEventListener("click", async () => {
      await loadInvoices();
      renderDashboard();
    });
  }

  if (el.toggleCliente) {
    el.toggleCliente.addEventListener("click", () => {
      const active = toggleButton(el.toggleCliente);
      el.clienteArea.classList.toggle("hidden", !active);

      if (!active) {
        setToggle(el.toggleEmpresa, false);
        el.rncMostrar.classList.add("hidden");
        state.selectedClientId = null;
      }

      updateClientSummary();
    });
  }

  if (el.toggleEmpresa) {
    el.toggleEmpresa.addEventListener("click", () => {
      if (!el.toggleCliente.classList.contains("active")) return;

      const active = toggleButton(el.toggleEmpresa);
      const selectedClient = state.clients.find(
        c => String(c.id) === String(state.selectedClientId)
      );

      if (active) {
        el.rncMostrar.classList.remove("hidden");

        if (selectedClient && selectedClient.rnc) {
          el.rncTexto.textContent = selectedClient.rnc;
          el.clienteRncManual.classList.add("hidden");
          el.clienteRncManual.value = "";
        } else {
          el.rncTexto.textContent = "";
          el.clienteRncManual.classList.remove("hidden");
        }
      } else {
        el.rncMostrar.classList.add("hidden");
        el.rncTexto.textContent = "";
        el.clienteRncManual.classList.add("hidden");
        el.clienteRncManual.value = "";
      }

      updateClientSummary();
    });
  }

  if (el.clienteRncManual) {
    el.clienteRncManual.addEventListener("input", updateClientSummary);
  }

  if (el.clienteNombre) {
    el.clienteNombre.addEventListener("input", () => {
      state.selectedClientId = null;
      renderClientSuggestions(el.clienteNombre.value);
      updateClientSummary();
    });

    el.clienteNombre.addEventListener("focus", () => {
      renderClientSuggestions(el.clienteNombre.value);
    });
  }

  if (el.productoNombre) {
    el.productoNombre.addEventListener("input", () => {
      state.selectedProductId = null;
      renderProductSuggestions(el.productoNombre.value);
    });

    el.productoNombre.addEventListener("focus", () => {
      renderProductSuggestions(el.productoNombre.value);
    });
  }

  document.addEventListener("click", event => {
    const removeButton = event.target.closest("[data-remove-index]");
    if (removeButton) {
      const index = Number(removeButton.dataset.removeIndex);
      removeInvoiceItem(index);
      return;
    }

    const productSuggestion = event.target.closest("[data-product-id]");
    if (productSuggestion && productSuggestion.closest("#productoSuggestions")) {
      selectProduct(productSuggestion.dataset.productId);
      return;
    }

    const clientSuggestion = event.target.closest("[data-client-id]");
    if (clientSuggestion && clientSuggestion.closest("#clienteSuggestions")) {
      selectClient(clientSuggestion.dataset.clientId);
      return;
    }

    const invoiceHistoryItem = event.target.closest(".invoice-history-item");
    if (invoiceHistoryItem) {
      openInvoiceDetail(invoiceHistoryItem.dataset.invoiceId);
      return;
    }

    const clientListItem = event.target.closest(".client-list-item");
    if (clientListItem) {
      openClientEdit(clientListItem.dataset.clientId);
      return;
    }

    const productListItem = event.target.closest(".product-list-item");
    if (productListItem) {
      openProductEdit(productListItem.dataset.productId);
      return;
    }

    if (!event.target.closest(".autocomplete-wrap")) {
      if (el.productoSuggestions) el.productoSuggestions.classList.add("hidden");
      if (el.clienteSuggestions) el.clienteSuggestions.classList.add("hidden");
    }
  });

  if (el.toggleItbis) {
    el.toggleItbis.addEventListener("click", () => {
      const active = toggleButton(el.toggleItbis);
      state.config.itbis = active;
      recalculateInvoice();
    });
  }

  if (el.btnAgregarProducto) el.btnAgregarProducto.addEventListener("click", addInvoiceItem);
  if (el.btnGuardarFactura) el.btnGuardarFactura.addEventListener("click", saveInvoice);

  if (el.btnImprimirFactura) {
    el.btnImprimirFactura.addEventListener("click", () => {
      const total = state.invoiceItems.reduce((acc, item) => acc + item.total, 0);
      const subtotal = state.config.itbis ? +(total / 1.18).toFixed(2) : +total.toFixed(2);
      const taxTotal = state.config.itbis ? +(total - subtotal).toFixed(2) : 0;

      const invoice = {
        invoice_number: el.numeroFactura.textContent,
        business_name: state.config.empresa,
        business_rnc: state.config.rnc,
        client_name: el.toggleCliente.classList.contains("active")
          ? el.clienteNombre.value.trim()
          : "",
        client_rnc: el.toggleEmpresa.classList.contains("active")
          ? getCurrentClientRnc()
          : "",
        subtotal,
        tax_total: taxTotal,
        total
      };

      const items = state.invoiceItems.map(item => ({
        description: item.nombre,
        quantity: item.cantidad,
        unit_price: item.precio,
        line_total: item.total
      }));

      printInvoiceData(invoice, items);
    });
  }

  if (el.historialSearch) el.historialSearch.addEventListener("input", renderHistorial);

  if (el.btnRefreshHistorial) {
    el.btnRefreshHistorial.addEventListener("click", async () => {
      await loadInvoices();
      renderHistorial();
    });
  }

  if (el.btnGuardarCliente) el.btnGuardarCliente.addEventListener("click", saveClient);

  if (el.btnRefreshClientes) {
    el.btnRefreshClientes.addEventListener("click", async () => {
      await loadClients();
      renderClients();
    });
  }

  if (el.btnGuardarProducto) el.btnGuardarProducto.addEventListener("click", saveProduct);

  if (el.btnRefreshProductos) {
    el.btnRefreshProductos.addEventListener("click", async () => {
      await loadProducts();
      renderProducts();
    });
  }

  if (el.btnGuardarAjustes) el.btnGuardarAjustes.addEventListener("click", saveSettings);
  if (el.btnVolverHistorial) el.btnVolverHistorial.addEventListener("click", () => showView("historial"));

  if (el.btnImprimirDetalle) {
    el.btnImprimirDetalle.addEventListener("click", () => {
      if (!state.selectedInvoice) return;
      printInvoiceData(state.selectedInvoice, state.selectedInvoiceItems || []);
    });
  }

  if (el.btnCloseClientEdit) el.btnCloseClientEdit.addEventListener("click", closeClientEdit);
  if (el.btnSaveClientEdit) el.btnSaveClientEdit.addEventListener("click", saveClientEdit);

  if (el.btnCloseProductEdit) el.btnCloseProductEdit.addEventListener("click", closeProductEdit);
  if (el.btnSaveProductEdit) el.btnSaveProductEdit.addEventListener("click", saveProductEdit);

  if (el.toggleEditProductActive) {
    el.toggleEditProductActive.addEventListener("click", () => {
      toggleButton(el.toggleEditProductActive);
    });
  }

  if (el.btnOpenMoreMenu) el.btnOpenMoreMenu.addEventListener("click", openMoreDrawer);
  if (el.btnBottomMore) el.btnBottomMore.addEventListener("click", openMoreDrawer);

  if (el.moreDrawer) {
    el.moreDrawer.addEventListener("click", e => {
      if (e.target === el.moreDrawer) closeMoreDrawer();
    });
  }

  if (el.moreDrawerItems) {
    el.moreDrawerItems.forEach(btn => {
      btn.addEventListener("click", () => {
        const view = btn.dataset.moreView;
        closeMoreDrawer();
        showView(view);
      });
    });
  }

  bindLogoUpload();
}
async function initApp() {
  if (state.isBootstrapping) return;
  state.isBootstrapping = true;

  try {
    const {
      data: { session },
      error
    } = await supabaseClient.auth.getSession();

    if (error || !session?.user) {
      showLoginView();
      return;
    }

    const sameUser = state.lastSessionUserId === session.user.id;
    const profileLoaded = await loadProfileFromSession(session);

    if (!profileLoaded) {
      showLoginView();
      return;
    }

    state.lastSessionUserId = session.user.id;
    showAppView();

   await Promise.all([
    loadInvoices(),
    loadClients(),
    loadProducts(),
    loadMonthlyInvoiceUsage()
]);
    ]);

    renderDashboard();
    renderHistorial();
    renderClients();
    renderProducts();
    updateUsageBanner();
    updateFacturaAvailability();

    if (!sameUser) {
      clearInvoiceForm();
      state.selectedInvoice = null;
      state.selectedInvoiceItems = [];
      showView("dashboard");
    } else {
      renderInvoiceTable();
      updateInvoiceActionButtons();
      recalculateInvoice();
      showView(state.currentView || "dashboard");
    }
  } catch (error) {
    console.error("initApp error:", error);
    showLoginView("No se pudo restaurar la sesión.");
  } finally {
    state.isBootstrapping = false;
  }
}

supabaseClient.auth.onAuthStateChange(async (_event, session) => {
  if (!state.authReady) return;

  if (session?.user) {
    state.lastSessionUserId = session.user.id;
    await initApp();
  } else {
    showLoginView();
  }
});

document.addEventListener("DOMContentLoaded", async () => {
  bindEvents();
  resetInvoiceMeta();
  state.authReady = true;
  await initApp();
});

const SUPABASE_URL = "https://exiedneezuzkdqfeqxlq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4aWVkbmVlenV6a2RxZmVxeGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTAxODAsImV4cCI6MjA4ODU4NjE4MH0.bVV5mlGZURw_H-xw0kVN9dI8jQ4NN9dgPQ9HlN4krEY";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  currentUser: null,
  currentView: "dashboard",
  config: {
    empresa: "JeanSkirt",
    rnc: "",
    itbis: true,
    logo: ""
  },
  invoiceItems: [],
  invoices: [],
  clients: [],
  products: [],
  selectedProductId: null,
  selectedClientId: null,
  selectedInvoice: null,
  selectedInvoiceItems: []
};

const el = {
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

function money(value) {
  return `RD$${Number(value || 0).toFixed(2)}`;
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
  const active = !button.classList.contains("active");
  setToggle(button, active);
  return active;
}

function resetInvoiceMeta() {
  const now = new Date();
  el.numeroFactura.textContent = "JS-" + now.getTime();
  el.fechaFactura.textContent = now.toLocaleDateString("es-DO");
}

function showView(viewName) {
  state.currentView = viewName;

  document.querySelectorAll(".view").forEach(view => {
    view.classList.toggle("active", view.id === `view-${viewName}`);
  });

  el.navItems.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.view === viewName);
  });

  el.headerTitle.textContent = viewTitles[viewName] || "Inicio";
}

function updateHeaderCompany() {
  const company = state.config.empresa || "JeanSkirt";
  if (el.headerCompany) el.headerCompany.textContent = company;
  if (el.dashboardCompany) el.dashboardCompany.textContent = company;
  if (el.empresaNombre) el.empresaNombre.textContent = company;
}

function updateLogo() {
  const logo = state.config.logo || "";
  if (el.logoImg) el.logoImg.src = logo;
  if (el.logoSettingsPreview) el.logoSettingsPreview.src = logo;
}

function updateClientSummary() {
  const clienteActivo = el.toggleCliente.classList.contains("active");
  const empresaActiva = el.toggleEmpresa.classList.contains("active");
  const nombre = el.clienteNombre.value.trim();

  if (!clienteActivo || !nombre) {
    el.clienteResumen.classList.add("hidden");
    el.clienteResumen.innerHTML = "";
    return;
  }

  if (empresaActiva) {
    el.clienteResumen.innerHTML = `<strong>Cliente:</strong> ${nombre}<br><strong>RNC:</strong> ${state.config.rnc || ""}`;
  } else {
    el.clienteResumen.innerHTML = `<strong>Cliente:</strong> ${nombre}`;
  }

  el.clienteResumen.classList.remove("hidden");
}

function renderInvoiceTable() {
  if (!state.invoiceItems.length) {
    el.tablaProductos.innerHTML = `<tr><td colspan="5" class="empty-cell">No hay productos agregados.</td></tr>`;
    return;
  }

  el.tablaProductos.innerHTML = state.invoiceItems.map((item, index) => `
    <tr>
      <td>${item.nombre}</td>
      <td class="right">${item.cantidad}</td>
      <td class="right">${money(item.precio)}</td>
      <td class="right">${money(item.total)}</td>
      <td class="right">
        <button type="button" class="icon-danger" onclick="removeInvoiceItem(${index})">Quitar</button>
      </td>
    </tr>
  `).join("");
}

function recalculateInvoice() {
  const total = state.invoiceItems.reduce((acc, item) => acc + item.total, 0);

  if (state.config.itbis) {
    const subtotal = total / 1.18;
    const itbis = total - subtotal;
    el.subtotalFactura.textContent = money(subtotal);
    el.itbisFactura.textContent = money(itbis);
    el.itbisRow.style.display = "";
  } else {
    el.subtotalFactura.textContent = money(total);
    el.itbisFactura.textContent = money(0);
    el.itbisRow.style.display = "none";
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

  el.clienteNombre.value = "";
  el.productoNombre.value = "";
  el.productoCantidad.value = "";
  el.productoPrecio.value = "";

  setToggle(el.toggleCliente, false);
  setToggle(el.toggleEmpresa, false);

  el.clienteArea.classList.add("hidden");
  el.rncMostrar.classList.add("hidden");
  el.clienteSuggestions.classList.add("hidden");
  el.productoSuggestions.classList.add("hidden");

  updateClientSummary();
}

function applyProfileToUI() {
  updateHeaderCompany();
  updateLogo();

  el.empresaInput.value = state.config.empresa || "JeanSkirt";
  el.rncInput.value = state.config.rnc || "";
  el.rncTexto.textContent = state.config.rnc || "";

  setToggle(el.toggleItbis, !!state.config.itbis);

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
    use_default_itbis: true
  };

  const { error: insertError } = await supabaseClient
    .from("business_settings")
    .insert(defaultSettings);

  if (insertError) throw insertError;
  return defaultSettings;
}

async function loadProfile() {
  const { data, error } = await supabaseClient.auth.getUser();
  if (error || !data?.user) return false;

  state.currentUser = data.user;

  await ensureProfile(state.currentUser);
  const business = await ensureBusinessSettings(state.currentUser);

  state.config = {
    empresa: business.business_name || "JeanSkirt",
    rnc: business.business_rnc || "",
    itbis: typeof business.use_default_itbis === "boolean" ? business.use_default_itbis : true,
    logo: business.business_logo || ""
  };

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

  setStatus(el.authMessage, "Cuenta creada. Si Supabase pide confirmación, revisa tu correo.");
}

async function loginUser() {
  const email = el.authEmail.value.trim();
  const password = el.authPassword.value.trim();

  if (!email || !password) {
    setStatus(el.authMessage, "Completa correo y contraseña.", true);
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

  if (error) {
    setStatus(el.authMessage, error.message, true);
    return;
  }

  setStatus(el.authMessage, "Sesión iniciada.");
  await initApp();
}

async function logoutUser() {
  await supabaseClient.auth.signOut();
  state.currentUser = null;
  el.appShell.classList.add("hidden");
  el.loginView.classList.remove("hidden");
  setStatus(el.authMessage, "Sesión cerrada.");
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
    use_default_itbis: state.config.itbis
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
  el.productoNombre.focus();

  state.selectedProductId = null;
  el.productoSuggestions.classList.add("hidden");

  setStatus(el.facturaMessage, "");
}

window.removeInvoiceItem = function(index) {
  state.invoiceItems.splice(index, 1);
  renderInvoiceTable();
  recalculateInvoice();
};

window.openInvoiceDetail = openInvoiceDetail;

async function saveInvoice() {
  if (!state.currentUser) return;

  if (!state.invoiceItems.length) {
    setStatus(el.facturaMessage, "Agrega al menos un producto.", true);
    return;
  }

  const total = state.invoiceItems.reduce((acc, item) => acc + item.total, 0);
  const subtotal = state.config.itbis ? +(total / 1.18).toFixed(2) : +total.toFixed(2);
  const taxTotal = state.config.itbis ? +(total - subtotal).toFixed(2) : 0;

  const cliente = el.toggleCliente.classList.contains("active") ? el.clienteNombre.value.trim() : "";
  const esEmpresa = el.toggleEmpresa.classList.contains("active");

  const invoicePayload = {
    user_id: state.currentUser.id,
    client_id: state.selectedClientId || null,
    client_name: cliente || null,
    client_rnc: esEmpresa ? state.config.rnc || null : null,
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
  renderDashboard();
  renderHistorial();
  clearInvoiceForm();
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

  const todayInvoices = state.invoices.filter(item => String(item.created_at || "").slice(0, 10) === todayKey);
  const monthInvoices = state.invoices.filter(item => String(item.created_at || "").slice(0, 7) === monthKey);

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
  <div class="list-item" style="cursor:pointer" onclick="openInvoiceDetail('${invoice.id}')">
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
    <div class="list-item">
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
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    console.error(error);
    state.products = [];
    return;
  }

  state.products = data || [];
}

function renderProducts() {
  if (!state.products.length) {
    el.productosList.innerHTML = "No hay productos guardados.";
    el.productosList.classList.add("empty-state");
    return;
  }

  el.productosList.classList.remove("empty-state");
  el.productosList.innerHTML = state.products.map(product => `
    <div class="list-item">
      <div class="list-title">${product.name}</div>
      <div class="list-meta">
        ${money(product.price)}
        ${product.description ? ` • ${product.description}` : ""}
      </div>
    </div>
  `).join("");
}

function renderProductSuggestions(filter = "") {
  if (!el.productoSuggestions) return;

  const q = filter.trim().toLowerCase();

  const filtered = state.products.filter(product =>
    !q ||
    String(product.name || "").toLowerCase().includes(q) ||
    String(product.description || "").toLowerCase().includes(q)
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

  el.productoSuggestions.querySelectorAll(".autocomplete-item").forEach(item => {
    item.addEventListener("click", () => {
      const productId = item.dataset.productId;
      const product = state.products.find(p => String(p.id) === String(productId));
      if (!product) return;

      state.selectedProductId = product.id;
      el.productoNombre.value = product.name || "";
      el.productoPrecio.value = product.price ?? "";

      if (!el.productoCantidad.value) {
        el.productoCantidad.value = 1;
      }

      el.productoSuggestions.classList.add("hidden");
    });
  });
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

  el.clienteSuggestions.querySelectorAll(".autocomplete-item").forEach(item => {
    item.addEventListener("click", () => {
      const clientId = item.dataset.clientId;
      const client = state.clients.find(c => String(c.id) === String(clientId));
      if (!client) return;

      state.selectedClientId = client.id;
      el.clienteNombre.value = client.name || "";

      setToggle(el.toggleCliente, true);
      el.clienteArea.classList.remove("hidden");

      if (client.rnc) {
        setToggle(el.toggleEmpresa, true);
        el.rncMostrar.classList.remove("hidden");
      } else {
        setToggle(el.toggleEmpresa, false);
        el.rncMostrar.classList.add("hidden");
      }

      el.clienteSuggestions.classList.add("hidden");
      updateClientSummary();
    });
  });
}

function bindLogoUpload() {
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
  el.btnLogin.addEventListener("click", loginUser);
  el.btnRegister.addEventListener("click", registerUser);
  el.btnLogout.addEventListener("click", logoutUser);

  el.navItems.forEach(btn => btn.addEventListener("click", () => showView(btn.dataset.view)));

  el.btnGoFactura.addEventListener("click", () => showView("factura"));

  el.btnRefreshDashboard.addEventListener("click", async () => {
    await loadInvoices();
    renderDashboard();
  });

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

  el.toggleEmpresa.addEventListener("click", () => {
    if (!el.toggleCliente.classList.contains("active")) return;
    const active = toggleButton(el.toggleEmpresa);
    el.rncMostrar.classList.toggle("hidden", !active);
    updateClientSummary();
  });

  el.clienteNombre.addEventListener("input", () => {
    state.selectedClientId = null;
    renderClientSuggestions(el.clienteNombre.value);
    updateClientSummary();
  });

  el.clienteNombre.addEventListener("focus", () => {
    renderClientSuggestions(el.clienteNombre.value);
  });

  el.productoNombre.addEventListener("input", () => {
    state.selectedProductId = null;
    renderProductSuggestions(el.productoNombre.value);
  });

  el.productoNombre.addEventListener("focus", () => {
    renderProductSuggestions(el.productoNombre.value);
  });

  document.addEventListener("click", (event) => {
    if (!event.target.closest(".autocomplete-wrap")) {
      el.productoSuggestions.classList.add("hidden");
      el.clienteSuggestions.classList.add("hidden");
    }
  });

  el.toggleItbis.addEventListener("click", () => {
    const active = toggleButton(el.toggleItbis);
    state.config.itbis = active;
    recalculateInvoice();
  });

  el.btnAgregarProducto.addEventListener("click", addInvoiceItem);
  el.btnGuardarFactura.addEventListener("click", saveInvoice);
  el.btnImprimirFactura.addEventListener("click", () => window.print());

  el.historialSearch.addEventListener("input", renderHistorial);

  el.btnRefreshHistorial.addEventListener("click", async () => {
    await loadInvoices();
    renderHistorial();
  });

  el.btnGuardarCliente.addEventListener("click", saveClient);

  el.btnRefreshClientes.addEventListener("click", async () => {
    await loadClients();
    renderClients();
  });

  if (el.btnGuardarProducto) {
    el.btnGuardarProducto.addEventListener("click", saveProduct);
  }

  if (el.btnRefreshProductos) {
    el.btnRefreshProductos.addEventListener("click", async () => {
      await loadProducts();
      renderProducts();
    });
  }

  el.btnGuardarAjustes.addEventListener("click", saveSettings);

  if (el.btnVolverHistorial) {
    el.btnVolverHistorial.addEventListener("click", () => showView("historial"));
  }

  if (el.btnImprimirDetalle) {
    el.btnImprimirDetalle.addEventListener("click", () => window.print());
  }

  bindLogoUpload();
}

async function initApp() {
  const profileLoaded = await loadProfile();

  if (!profileLoaded) {
    el.loginView.classList.remove("hidden");
    el.appShell.classList.add("hidden");
    return;
  }

  el.loginView.classList.add("hidden");
  el.appShell.classList.remove("hidden");

  await Promise.all([
    loadInvoices(),
    loadClients(),
    loadProducts()
  ]);

  renderDashboard();
  renderHistorial();
  renderClients();
  renderProducts();
  clearInvoiceForm();
  showView(state.currentView);
}

supabaseClient.auth.onAuthStateChange(async (_event, session) => {
  if (session?.user) {
    await initApp();
  }
});

bindEvents();
resetInvoiceMeta();
initApp();

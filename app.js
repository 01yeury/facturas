const SUPABASE_URL = "https://exiedneezuzkdqfeqxlq.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4aWVkbmVlenV6a2RxZmVxeGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMTAxODAsImV4cCI6MjA4ODU4NjE4MH0.bVV5mlGZURw_H-xw0kVN9dI8jQ4NN9dgPQ9HlN4krEY";
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const state = {
  currentUser: null,
  currentView: "dashboard",
  config: { empresa: "JeanSkirt", rnc: "", itbis: true, logo: "" },
  invoiceItems: [],
  invoices: [],
  clients: []
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
  rncMostrar: document.getElementById("rncMostrar"),
  rncTexto: document.getElementById("rncTexto"),
  clienteResumen: document.getElementById("clienteResumen"),
  productoNombre: document.getElementById("productoNombre"),
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
  empresaInput: document.getElementById("empresaInput"),
  rncInput: document.getElementById("rncInput"),
  logoInput: document.getElementById("logoInput"),
  dropArea: document.getElementById("dropArea"),
  toggleItbis: document.getElementById("toggleItbis"),
  btnGuardarAjustes: document.getElementById("btnGuardarAjustes"),
  ajustesMessage: document.getElementById("ajustesMessage")
};

const viewTitles = {
  dashboard: "Inicio",
  factura: "Facturar",
  historial: "Historial",
  clientes: "Clientes",
  ajustes: "Ajustes"
};

function money(value) {
  return `RD$${Number(value || 0).toFixed(2)}`;
}

function setStatus(target, text, isError = false) {
  target.textContent = text || "";
  target.style.color = isError ? "#b42318" : "#6b7280";
}

function setToggle(button, active) {
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
  el.headerCompany.textContent = company;
  el.dashboardCompany.textContent = company;
  el.empresaNombre.textContent = company;
}

function updateLogo() {
  const logo = state.config.logo || "";
  el.logoImg.src = logo;
  el.logoSettingsPreview.src = logo;
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
      <td class="right"><button type="button" class="icon-danger" onclick="removeInvoiceItem(${index})">Quitar</button></td>
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
  renderInvoiceTable();
  recalculateInvoice();
  setStatus(el.facturaMessage, "");
  resetInvoiceMeta();
  el.clienteNombre.value = "";
  setToggle(el.toggleCliente, false);
  setToggle(el.toggleEmpresa, false);
  el.clienteArea.classList.add("hidden");
  el.rncMostrar.classList.add("hidden");
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

  const { error: insertError } = await supabaseClient.from("profiles").insert(defaultProfile);
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

  const { error } = await supabaseClient.from("business_settings").upsert(payload, { onConflict: "user_id" });

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
  setStatus(el.facturaMessage, "");
}

window.removeInvoiceItem = function(index) {
  state.invoiceItems.splice(index, 1);
  renderInvoiceTable();
  recalculateInvoice();
};

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
    client_id: null,
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
    product_id: null,
    description: item.nombre,
    quantity: item.cantidad,
    unit_price: item.precio,
    tax_rate: state.config.itbis ? 0.18 : 0,
    line_total: item.total
  }));

  const { error: itemsError } = await supabaseClient.from("invoice_items").insert(itemsPayload);

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
    <div class="list-item">
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

  const { error } = await supabaseClient.from("clients").insert({
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
    }

    updateClientSummary();
  });

  el.toggleEmpresa.addEventListener("click", () => {
    if (!el.toggleCliente.classList.contains("active")) return;
    const active = toggleButton(el.toggleEmpresa);
    el.rncMostrar.classList.toggle("hidden", !active);
    updateClientSummary();
  });

  el.clienteNombre.addEventListener("input", updateClientSummary);

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

  el.btnGuardarAjustes.addEventListener("click", saveSettings);

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

  await Promise.all([loadInvoices(), loadClients()]);

  renderDashboard();
  renderHistorial();
  renderClients();
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
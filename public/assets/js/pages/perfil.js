import { Auth } from "../auth.js";
import { urlImagemSegura } from "../utils/url-segura.js";

const API_BASE = window.location.pathname.includes("/pages/")
  ? "../../api"
  : "../api";

document.addEventListener("DOMContentLoaded", () => {

  if (!Auth.isAuthenticated())
  {
    Swal.fire({
      title: "Acesso Restrito",
      html: '<p style="color: var(--ink-black); margin-top: 10px;">Você precisa estar logado para acessar seu perfil.</p>',
      icon: "warning",
      iconColor: "#598392",
      background: "rgba(255, 255, 255, 0.95)",
      backdrop: "rgba(0, 0, 0, 0.5)",
      confirmButtonColor: "#124559",
      confirmButtonText: "Ir para Login",
      allowOutsideClick: false,
      allowEscapeKey: false,
      willClose: () => {
        window.location.href = "login.php";
      },
    });
    return;
  }

  const perfilNome = document.getElementById("perfilNome");
  const perfilUsername = document.getElementById("perfilUsername");
  const perfilBio = document.getElementById("perfilBio");
  const perfilCidade = document.getElementById("perfilCidade");
  const perfilProfissao = document.getElementById("perfilProfissao");
  const perfilWebsite = document.getElementById("perfilWebsite");
  const perfilDataCadastro = document.getElementById("perfilDataCadastro");
  const perfilAvatar = document.getElementById("perfilAvatar");
  const perfilBanner = document.getElementById("perfilBanner");
  const perfilTipoBadge = document.getElementById("perfilTipoBadge");

  const btnEditarPerfil = document.getElementById("btnEditarPerfil");
  const btnEditarBanner = document.getElementById("btnEditarBanner");
  const btnFecharModal = document.getElementById("btnFecharModal");
  const btnCancelarEditar = document.getElementById("btnCancelarEditar");
  const btnSalvarWallpaper = document.getElementById("btnSalvarWallpaper");
  const btnAlterarSenha = document.getElementById("btnAlterarSenha");
  const senhaToggle = document.getElementById("senhaToggle");
  const senhaFields = document.getElementById("senhaFields");
  const senhaToggleIcon = document.getElementById("senhaToggleIcon");

  const modalEditar = document.getElementById("modalEditar");
  const modalCrop = document.getElementById("modal-crop-foto");
  const modalWallpaper = document.getElementById("modalWallpaper");

  const formEditar = document.getElementById("formEditar");
  const editNome = document.getElementById("editNome");
  const editEmail = document.getElementById("editEmail");
  const editBio = document.getElementById("editBio");
  const editCidade = document.getElementById("editCidade");
  const editProfissao = document.getElementById("editProfissao");
  const editWebsite = document.getElementById("editWebsite");
  const editTelefone = document.getElementById("editTelefone");
  const editDataNascimento = document.getElementById("editDataNascimento");
  const hintNome = document.getElementById("hintNome");
  const hintBio = document.getElementById("hintBio");

  const statConsumo = document.getElementById("statConsumo");
  const statEconomia = document.getElementById("statEconomia");
  const statEficiencia = document.getElementById("statEficiencia");
  const statPontuacao = document.getElementById("statPontuacao");

  let cropperWallpaper = null;
  const imageElementWallpaper = document.getElementById(
    "imagem-para-cortar-wallpaper",
  );
  const cropperContainerWallpaper = document.getElementById(
    "containerCropperWallpaper",
  );
  const fileWallpaper = document.getElementById("fileWallpaper");

  if (fileWallpaper)
  {
    fileWallpaper.addEventListener("click", function () {
      this.value = null;
    });
  }

  if (btnEditarBanner)
  {
    btnEditarBanner.addEventListener("click", (e) => {
      e.stopPropagation();

      if (modalWallpaper) modalWallpaper.classList.add("ativo");
    });
  }

  window.fecharModalWallpaper = function () {

    if (modalWallpaper)
    {
      modalWallpaper.classList.remove("ativo");
      document.getElementById("urlWallpaper").value = "";

      if (cropperWallpaper)
      {
        cropperWallpaper.destroy();
        cropperWallpaper = null;
      }

      if (cropperContainerWallpaper)
      {
        cropperContainerWallpaper.style.display = "none";
      }

      if (btnSalvarWallpaper) btnSalvarWallpaper.style.display = "none";
    }

  };

  function carregarImagemNoCropper(source)
  {

    if (cropperWallpaper)
    {
      cropperWallpaper.destroy();
    }

    definirSrcSeguro(imageElementWallpaper, source);

    if (cropperContainerWallpaper)
    {
      cropperContainerWallpaper.style.display = "block";
    }

    cropperWallpaper = new Cropper(imageElementWallpaper, {
      aspectRatio: 16 / 9,
      viewMode: 2,
      background: false,
      ready() {
      },
    });

    if (btnSalvarWallpaper) btnSalvarWallpaper.style.display = "inline-block";
  }

  function processarArquivoWallpaper(file)
  {

    if (!file.type.startsWith("image/"))
    {
      Swal.fire("Erro", "O arquivo precisa ser uma imagem!", "error");
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      carregarImagemNoCropper(e.target.result);

      if (document.getElementById("fileWallpaper"))
      {
        document.getElementById("fileWallpaper").value = "";
      }

    };

    reader.readAsDataURL(file);
  }

  document
    .getElementById("urlWallpaper")
    ?.addEventListener("change", function (e) {

      if (e.target.value) carregarImagemNoCropper(e.target.value);
    });

  document
    .getElementById("fileWallpaper")
    ?.addEventListener("change", function (e) {
      const file = e.target.files[0];

      if (file) processarArquivoWallpaper(file);
    });

  const dropzoneWallpaper = document.getElementById("dropzoneWallpaper");

  if (dropzoneWallpaper)
  {
    dropzoneWallpaper.addEventListener("click", () =>
      document.getElementById("fileWallpaper").click(),
    );

    dropzoneWallpaper.addEventListener("dragover", (e) => {
      e.preventDefault();
      dropzoneWallpaper.style.borderColor = "var(--cor-botao)";
      dropzoneWallpaper.style.background = "rgba(89, 131, 146, 0.1)";
    });

    dropzoneWallpaper.addEventListener("dragleave", () => {
      dropzoneWallpaper.style.borderColor = "var(--air-force-blue)";
      dropzoneWallpaper.style.background = "";
    });

    dropzoneWallpaper.addEventListener("drop", (e) => {
      e.preventDefault();
      dropzoneWallpaper.style.borderColor = "var(--air-force-blue)";
      dropzoneWallpaper.style.background = "";
      const file = e.dataTransfer.files[0];

      if (file) processarArquivoWallpaper(file);
    });
  }

  if (btnSalvarWallpaper)
  {
    btnSalvarWallpaper.addEventListener("click", async () => {
      const textoOriginal = btnSalvarWallpaper.innerHTML;
      btnSalvarWallpaper.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Salvando...';
      btnSalvarWallpaper.disabled = true;

      try
      {
        let finalData = null;

        if (cropperWallpaper)
        {
          const canvas = cropperWallpaper.getCroppedCanvas({
            width: 1920,
            height: 1080,
            imageSmoothingEnabled: true,
            imageSmoothingQuality: "high",
          });

          finalData = canvas.toDataURL("image/jpeg", 0.7);
        }
        else
        {
          finalData = document.getElementById("urlWallpaper").value.trim();
        }

        if (!finalData)
        {
          Swal.fire(
            "Aviso",
            "Selecione uma imagem ou cole uma URL primeiro.",
            "warning",
          );
          return;
        }

        const userData = Auth.getCurrentUser();
        const result = await Auth.updateWallpaper(finalData);

        if (result.success)
        {

          if (perfilBanner)
            perfilBanner.style.backgroundImage = `url('${finalData}')`;
          fecharModalWallpaper();
          Swal.fire({
            title: "Sucesso ",
            text: "Seu banner foi atualizado!",
            icon: "success",
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
          });
        }
        else
        {
          Swal.fire(
            "Erro",
            result.message || "Não foi possível salvar o banner.",
            "error",
          );
        }

      }

      catch (err)
      {
        Swal.fire("Erro", "Erro inesperado ao salvar o banner.", "error");
      }
      finally
      {
        btnSalvarWallpaper.innerHTML = textoOriginal;
        btnSalvarWallpaper.disabled = false;
      }

    });
  }

  function carregarWallpaper()
  {
    const userData = Auth.getCurrentUser();

    if (userData && userData.wallpaper && perfilBanner)
    {
      perfilBanner.style.backgroundImage = `url('${userData.wallpaper}')`;
    }

  }

  function carregarDadosUsuario()
  {
    const userData = Auth.getCurrentUser();

    if (!userData)
    {
      window.location.href = "login.php";
      return;
    }


    const nomeCompleto = userData.nome || "Usuário";

    if (perfilNome) perfilNome.textContent = nomeCompleto;

    const username = "@" + nomeCompleto.toLowerCase().replace(/\s+/g, "");

    if (perfilUsername) perfilUsername.textContent = username;

    const emailEl =
      document.getElementById("perfilEmail") ||
      document.querySelector(".user-email");

    if (emailEl)
    {
      emailEl.textContent = userData.email;
      emailEl.style.display = "block";
    }

    if (perfilBio)
      perfilBio.textContent =
        userData.bio || "Adicione uma descrição ao seu perfil";

    if (perfilCidade)
      perfilCidade.textContent = userData.cidade || "Cidade não informada";

    if (perfilProfissao)
      perfilProfissao.textContent =
        userData.profissao || "Profissão não informada";

    if (perfilWebsite)
    {

      if (userData.website && userData.website.trim())
      {
        perfilWebsite.href = userData.website;
        perfilWebsite.textContent = userData.website;
        perfilWebsite.style.display = "inline-flex";
      }
      else
      {
        perfilWebsite.style.display = "none";
      }

    }

    const perfilTelefone = document.getElementById("perfilTelefone");

    if (perfilTelefone)
    {
      perfilTelefone.textContent =
        userData.telefone || "Telefone não informado";
    }

    const perfilDataNascimento = document.getElementById(
      "perfilDataNascimento",
    );

    if (perfilDataNascimento)
    {

      if (userData.data_nascimento)
      {
        const partes = userData.data_nascimento.split("-");
        perfilDataNascimento.textContent = `${partes[2]}/${partes[1]}/${partes[0]}`;
      }
      else
      {
        perfilDataNascimento.textContent = "Data não disponível";
      }

    }

    if (perfilDataCadastro)
    {

      if (userData.data_cadastro)
      {
        const data = new Date(userData.data_cadastro);
        const mes = data.toLocaleDateString("pt-BR", { month: "long" });
        const ano = data.getFullYear();
        perfilDataCadastro.textContent = `Membro desde ${mes} de ${ano}`;
      }
      else
      {
        perfilDataCadastro.textContent = "Data não disponível";
      }

    }

    if (perfilTipoBadge)
    {
      const tipo = parseInt(userData.tipo_usuario) || 1;
      const config = {
        1: { label: "Usuário", icon: "fa-user", classe: "padrao" },
        2: {
          label: "Administrador",
          icon: "fa-shield-halved",
          classe: "admin",
        },
        3: { label: "Corporativo", icon: "fa-building", classe: "corporativo" },
      };

      const info = config[tipo] || config[1];
      perfilTipoBadge.className = `perfil-tipo-badge ${info.classe}`;
      perfilTipoBadge.innerHTML = `<i class="fas ${info.icon}"></i> ${info.label}`;
    }

    atualizarAvatar(userData);
    carregarEstatisticas(userData);
    carregarAtividade();
    atualizarAvatarModal(userData);
  }

  function atualizarAvatar(userData)
  {
    const temFoto = userData.avatar && userData.avatar.length > 50;

    if (temFoto)
    {

      if (perfilAvatar)
        perfilAvatar.innerHTML = `<img src="${userData.avatar}" alt="Foto de perfil">`;
    }
    else
    {

      if (perfilAvatar)
      {
        const inicial = userData.nome
          ? userData.nome.charAt(0).toUpperCase()
          : "?";
        const corFundo = gerarCorAvatarSegura(userData.email);
        perfilAvatar.innerHTML = `
            <div style="
                background: ${corFundo};
                color: white;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                font-weight: bold;
                font-size: 3.5rem;
                font-family: 'Montserrat', sans-serif;
            ">
                ${inicial}
            </div>
        `;
      }

    }

  }

  function gerarCorAvatarSegura(email)
  {
    let hash = 0;
    const str = email || "default";

    for (let i = 0; i < str.length; i++)
    {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }

    const h = Math.abs(hash % 360);
    const s = 65;
    const l = 30;
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  const btnModalFoto = document.getElementById("btnModalFoto");
  const modalFotoPerfil = document.getElementById("modalFotoPerfil");

  function atualizarAvatarModal(userData)
  {

    if (!modalFotoPerfil) return;
    const temFoto = userData.avatar && userData.avatar.length > 50;

    if (temFoto)
    {
      modalFotoPerfil.innerHTML = `<img src="${userData.avatar}" alt="Foto de perfil">`;
      modalFotoPerfil.style.background = "transparent";
    }
    else
    {
      const inicial = userData.nome
        ? userData.nome.charAt(0).toUpperCase()
        : "?";
      const corFundo = gerarCorAvatarSegura(userData.email);
      modalFotoPerfil.style.background = corFundo;
      modalFotoPerfil.innerHTML = `<span>${inicial}</span>`;
    }

  }

  if (btnModalFoto)
  {
    btnModalFoto.addEventListener("click", () => {

      if (modalCrop) modalCrop.style.display = "flex";
    });
  }

  async function carregarEstatisticas(userData)
  {
    let gastos = [];
    try
    {
      const res = await fetch(`${API_BASE}/gastos/listar.php`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.gastos))
      {
        gastos = json.gastos;
      }

    }

    catch (e)
    {
    }

    if (gastos.length === 0)
    {
      renderizarEstadoVazio();
      carregarStatusArduino();
      renderizarMetas([]);
      renderizarMiniChart([]);
      return;
    }

    const totalConsumo = gastos.reduce(
      (s, r) => s + (parseFloat(r.consumo_m3) || 0),
      0,
    );
    const economia = totalConsumo > 0 ? totalConsumo * 100 : 0;

    if (statConsumo)
      statConsumo.innerHTML = `${totalConsumo.toFixed(1)} <small>m³</small>`;

    if (statEconomia) statEconomia.textContent = `${Math.round(economia)} L`;

    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    const meta = carregarMeta();
    let eficienciaValor = null;

    if (meta && meta.mes === mesAtual && meta.ano === anoAtual && meta.alvoM3 > 0)
    {
      const prefixoMes = anoAtual + "-" + String(mesAtual).padStart(2, "0");
      const totalMes = gastos
        .filter(
          (r) => r.data_leitura && r.data_leitura.startsWith(prefixoMes),
        )
        .reduce((s, r) => s + (parseFloat(r.consumo_m3) || 0), 0);
      const aderencia = (1 - (totalMes - meta.alvoM3) / meta.alvoM3) * 100;
      eficienciaValor = Math.max(0, Math.min(100, Math.round(aderencia)));
    }

    if (statEficiencia)
    {
      statEficiencia.textContent =
        eficienciaValor === null ? "--" : `${eficienciaValor}%`;
      statEficiencia.title =
        "Aderência ao consumo máximo definido na sua meta mensal";
    }

    const pontuacao =
      gastos.length * 10 + (eficienciaValor >= 100 ? 100 : 0);

    if (statPontuacao)
    {
      statPontuacao.textContent = `${pontuacao} pts`;
      statPontuacao.title =
        "10 pontos por medição registrada + 100 de bônus com a meta mensal em dia";
    }

    carregarStatusArduino();
    renderizarMetas(gastos);
    renderizarMiniChart(gastos);
  }

  function renderizarEstadoVazio()
  {
    const grid = document.querySelector(".stats-grid-inner");

    if (!grid) return;

    grid.innerHTML = "";

    const emptyCard = document.createElement("div");
    emptyCard.style.cssText = `
            grid-column: 1 / -1;
            text-align: center;
            padding: 60px 30px;
            background: var(--glass-bg);
            border-radius: 18px;
            border: 1px dashed rgba(134,179,189,0.35);
        `;
    emptyCard.innerHTML = `
            <div style="font-size: 3rem; color: var(--air-force-blue); margin-bottom: 16px;">
                <i class="fas fa-chart-simple"></i>
            </div>
            <h3 style="color: var(--texto-secundario); margin-bottom: 8px; font-weight: 700; font-size: 1.3rem;">
                Nenhum consumo registrado ainda
            </h3>
            <p style="color: var(--air-force-blue); max-width: 420px; margin: 0 auto 24px; line-height: 1.7; font-size: 0.95rem;">
                Seus dados de consumo aparecerão aqui assim que você fizer sua primeira
                medição no <strong>Dashboard</strong>.
            </p>
            <a href="dashboard.php" style="
                display: inline-flex; align-items: center; gap: 10px;
                padding: 14px 32px; border-radius: 50px;
                background: var(--cor-botao); color: white; font-weight: 700;
                text-decoration: none; font-size: 0.9rem;
                transition: all 0.3s ease;
                font-family: 'Montserrat', sans-serif;
                box-shadow: 0 6px 20px rgba(18,69,89,0.25);
            " onmouseover="this.style.transform='translateY(-3px)';this.style.boxShadow='0 10px 30px rgba(18,69,89,0.35)'"
             onmouseout="this.style.transform='';this.style.boxShadow=''">
                <i class="fas fa-calculator"></i>
                Ir para Calculadora
            </a>
        `;
    grid.appendChild(emptyCard);
  }

  function renderizarMetas(gastos)
  {
    const card = document.getElementById("metasCard");

    if (!card) return;

    const hoje = new Date();
    const mesAtual = hoje.getMonth() + 1;
    const anoAtual = hoje.getFullYear();
    const meta = carregarMeta();

    if (!meta || meta.mes !== mesAtual || meta.ano !== anoAtual)
    {
      const meses = [
        "Jan",
        "Fev",
        "Mar",
        "Abr",
        "Mai",
        "Jun",
        "Jul",
        "Ago",
        "Set",
        "Out",
        "Nov",
        "Dez",
      ];
      card.innerHTML = `
                <div class="metas-empty">
                    <i class="fas fa-flag"></i>
                    <p>Nenhuma meta definida para ${meses[mesAtual - 1]} de ${anoAtual}.</p>
                    <button class="metas-empty-btn" id="metasEmptyBtn">Definir minha meta</button>
                </div>`;
      document
        .getElementById("metasEmptyBtn")
        ?.addEventListener("click", abrirModalMetaPerfil);
      return;
    }

    const prefixoMes = anoAtual + "-" + String(mesAtual).padStart(2, "0");
    const desteMes = gastos.filter(
      (r) => r.data_leitura && r.data_leitura.startsWith(prefixoMes),
    );
    const totalMes = desteMes.reduce(
      (s, r) => s + (parseFloat(r.consumo_m3) || 0),
      0,
    );
    const pct =
      meta.alvoM3 > 0 ? Math.min(100, (totalMes / meta.alvoM3) * 100) : 0;
    const restante = Math.max(0, meta.alvoM3 - totalMes);

    const diasComDados = new Set(desteMes.map((r) => r.data_leitura)).size;
    const ultimoDia = new Date(
      hoje.getFullYear(),
      hoje.getMonth() + 1,
      0,
    ).getDate();
    const mediaDiaria = diasComDados > 0 ? totalMes / diasComDados : 0;
    const diasRestantes = ultimoDia - hoje.getDate();
    const projecaoFinal =
      totalMes + (diasRestantes > 0 ? mediaDiaria * diasRestantes : 0);
    const vaiUltrapassar = projecaoFinal > meta.alvoM3;

    let corBarra;

    if (pct >= 90) corBarra = "#e74c3c";

    else if (pct >= 70) corBarra = "#e8a838";
    else corBarra = "#27ae60";

    card.innerHTML = `
            <div class="metas-active">
                <div class="metas-stats">
                    <div class="metas-stat-item">
                        <span class="metas-stat-label">Meta</span>
                        <span class="metas-stat-value">${meta.alvoM3.toFixed(1)} <small>m³</small></span>
                    </div>
                    <div class="metas-stat-item">
                        <span class="metas-stat-label">Consumido</span>
                        <span class="metas-stat-value">${totalMes.toFixed(1)} <small>m³</small></span>
                    </div>
                    <div class="metas-stat-item">
                        <span class="metas-stat-label">Restante</span>
                        <span class="metas-stat-value">${restante.toFixed(1)} <small>m³</small></span>
                    </div>
                    <div class="metas-stat-item">
                        <span class="metas-stat-label">Projeção</span>
                        <span class="metas-stat-value" style="color:${vaiUltrapassar ? "#e74c3c" : "#27ae60"}">${projecaoFinal.toFixed(1)} <small>m³</small></span>
                    </div>
                </div>
                <div class="metas-progress-container">
                    <div class="metas-progress-header">
                        <span>${pct.toFixed(0)}% utilizado</span>
                        <span>${(100 - Math.min(100, pct)).toFixed(0)}% restante</span>
                    </div>
                    <div class="metas-progress-bar">
                        <div class="metas-progress-fill" style="width:${Math.min(100, pct)}%;background:${corBarra};"></div>
                    </div>
                </div>
                <div class="metas-prediction">
                    ${
                      vaiUltrapassar
                        ? `<span style="color:#e74c3c">⚠️ Projeção indica que ultrapassará a meta em <strong>${(projecaoFinal - meta.alvoM3).toFixed(1)} m³</strong>.</span>`
                        : `<span style="color:#27ae60">✅ Dentro da meta! Folga de <strong>${restante.toFixed(1)} m³</strong>.</span>`
                    }

                </div>
            </div>`;
  }

  function getMetaKey()
  {
    const user = Auth.getCurrentUser();
    return "victoria_meta_" + (user?.id || "anon");
  }

  function carregarMeta()
  {
    try
    {
      const raw = localStorage.getItem(getMetaKey());
      return raw ? JSON.parse(raw) : null;
    }
    catch
    {
      return null;
    }

  }

  function salvarMeta(alvoM3, mes, ano)
  {
    const meta = { alvoM3: parseFloat(alvoM3), mes, ano };
    try
    {
      localStorage.setItem(getMetaKey(), JSON.stringify(meta));
    } catch {}
  }

  function abrirModalMetaPerfil()
  {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const ano = hoje.getFullYear();
    const meta = carregarMeta();
    const meses = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ];
    const valorInicial =
      meta && meta.mes === mes && meta.ano === ano ? meta.alvoM3 : "";

    Swal.fire({
      title: `Definir Meta — ${meses[mes - 1]} ${ano}`,
      html: `
                <div style="text-align:left;margin-bottom:12px;font-family:'Montserrat',sans-serif;font-size:0.85rem;color:var(--air-force-blue);">
                    Qual o consumo máximo que você deseja atingir este mês?
                </div>
                <input id="swalMetaInput" class="swal2-input" type="number" step="0.1" min="1"
                       placeholder="Ex: 30" value="${valorInicial}"
                       style="font-family:'Montserrat',sans-serif;font-weight:700;">
                <div style="text-align:center;margin-top:6px;font-size:0.78rem;color:var(--ash-grey);font-weight:600;">
                    em metros cúbicos (m³)
                </div>
            `,
      confirmButtonText: "Salvar Meta",
      confirmButtonColor: "var(--cor-botao)",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        const val = document.getElementById("swalMetaInput")?.value;

        if (!val || parseFloat(val) <= 0)
        {
          Swal.showValidationMessage("Digite um valor válido maior que zero.");
          return false;
        }

        return parseFloat(val);
      },
    }).then((result) => {

      if (result.isConfirmed && result.value)
      {
        salvarMeta(result.value, mes, ano);

        carregarEstatisticas(Auth.getCurrentUser());
        Swal.fire({
          icon: "success",
          title: "Meta definida!",
          text: `Consumo máximo de ${result.value.toFixed(1)} m³ para ${meses[mes - 1]}.`,
          confirmButtonColor: "var(--cor-botao)",
        });
      }

    });
  }

  let miniChartInstance = null;

  function renderizarMiniChart(gastos)
  {
    const container = document.getElementById("miniChartContainer");

    if (!container || typeof ApexCharts === "undefined") return;

    const temaEscuro = document.documentElement.dataset.theme === "dark";
    const corBarra = temaEscuro ? "#86b3bd" : "#598392";
    const corGrid = temaEscuro ? "rgba(134, 179, 189, 0.12)" : "rgba(89, 131, 146, 0.08)";

    if (miniChartInstance)
    {
      miniChartInstance.destroy();
      miniChartInstance = null;
    }

    container.innerHTML = "";

    if (!gastos || gastos.length === 0)
    {
      container.innerHTML = `
                <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:180px;color:var(--air-force-blue);gap:10px;">
                    <i class="fas fa-chart-line" style="font-size:1.8rem;opacity:0.3;"></i>
                    <span style="font-size:0.82rem;font-weight:600;opacity:0.6;">Sem dados para exibir</span>
                </div>
            `;
      return;
    }

    const porMes = {};
    const hoje = new Date();

    for (let i = 5; i >= 0; i--)
    {
      const d = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const chave = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      porMes[chave] = 0;
    }

    gastos.forEach((r) => {
      const dataRaw = r.data_leitura || "";

      if (!dataRaw) return;
      const chave = dataRaw.substring(0, 7);

      if (porMes[chave] !== undefined)
      {
        porMes[chave] += parseFloat(r.consumo_m3) || 0;
      }

    });

    const categorias = Object.keys(porMes);
    const valores = Object.values(porMes).map((v) => parseFloat(v.toFixed(2)));
    const mesesAbr = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
      "Dez",
    ];
    const labels = categorias.map((c) => {
      const m = parseInt(c.split("-")[1], 10);
      return mesesAbr[m - 1] || c;
    });

    miniChartInstance = new ApexCharts(container, {
      series: [{ name: "Consumo", data: valores }],
      chart: {
        type: "bar",
        height: 180,
        fontFamily: "Montserrat, sans-serif",
        toolbar: { show: false },
        animations: {
          enabled: true,
          speed: 600,
          animateGradually: { enabled: true },
        },
      },
      colors: [corBarra],
      plotOptions: {
        bar: { borderRadius: 6, columnWidth: "55%", distributed: false },
      },
      dataLabels: { enabled: false },
      xaxis: {
        categories: labels,
        labels: {
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
            colors: [corBarra],
          },
        },
      },
      yaxis: {
        show: true,
        labels: {
          formatter: (v) => v.toFixed(1),
          style: {
            fontFamily: "Montserrat, sans-serif",
            fontSize: "10px",
            fontWeight: 600,
            colors: [corBarra],
          },
        },
      },
      grid: { borderColor: corGrid, strokeDashArray: 4 },
      tooltip: {
        y: { formatter: (v) => v.toFixed(2) + " m³" },
      },
      noData: {
        text: "Sem dados para exibir",
        style: {
          fontFamily: "Montserrat, sans-serif",
          fontSize: "13px",
          color: "#598392",
        },
      },
    });
    miniChartInstance.render();
  }

  async function carregarStatusArduino()
  {
    const statusArduino = document.getElementById("statusArduinoSidebar");

    if (!statusArduino) return;

    let isOnline = false;

    try
    {
      const res = await fetch(`${API_BASE}/status/arduino.php`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success)
      {
        isOnline = Boolean(json.online);
      }
    }

    catch (erroArduino)
    {
      isOnline = false;
    }

    const statusText = isOnline ? "Online" : "Offline";
    const statusColor = isOnline ? "#27ae60" : "#e74c3c";
    const statusIcon = isOnline ? "fa-check-circle" : "fa-times-circle";

    statusArduino.innerHTML = `
            <div class="arduino-sidebar-card">
                <div class="arduino-sidebar-header">
                    <i class="fas fa-microchip"></i>
                    <span>Status do Arduino</span>
                </div>
                <div class="arduino-sidebar-body">
                    <span class="arduino-sidebar-icon" style="color:${statusColor} !important;">
                        <i class="fas ${statusIcon}" style="color:${statusColor} !important;"></i>
                    </span>
                    <span class="arduino-sidebar-text" style="color:${statusColor} !important;">
                        ${statusText}
                    </span>
                </div>
            </div>
        `;
  }

  async function carregarAtividade()
  {
    const activityList = document.getElementById("activityList");

    if (!activityList) return;

    let gastos = [];
    try
    {
      const res = await fetch(`${API_BASE}/gastos/listar.php`, {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success && Array.isArray(json.gastos))
      {
        gastos = json.gastos;
      }

    }

    catch (e)
    {
    }

    if (gastos.length === 0)
    {
      activityList.innerHTML = `
                <div style="text-align: center; padding: 50px 20px; color: #598392;">
                    <i class="fas fa-water" style="font-size: 2.5rem; margin-bottom: 14px; opacity: 0.4;"></i>
                    <p style="font-size: 0.9rem; font-weight: 600;">
                        Nenhuma medição registrada.
                    </p>
                    <p style="font-size: 0.8rem; margin-top: 6px; opacity: 0.7;">
                        Suas leituras aparecerão aqui automaticamente.
                    </p>
                </div>
            `;
      return;
    }

    const recentes = gastos.slice(0, 5);
    activityList.innerHTML = recentes
      .map((g) => {
        const valor = parseFloat(g.valor_estimado) || 0;
        const valorFmt = valor.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        });
        const consumoNum = parseFloat(g.consumo_m3);
        const consumoFmt =
          g.consumo ||
          (isFinite(consumoNum) ? consumoNum.toFixed(2) + " m³" : "0 m³");
        const dataFmt = g.data || g.data_leitura || "--";
        return `
                <div class="activity-item">
                    <div class="activity-icon">
                        <i class="fas fa-water"></i>
                    </div>
                    <div class="activity-content">
                        <p class="activity-title">
                            ${consumoFmt} — ${valorFmt}
                        </p>
                        <p class="activity-time">${dataFmt}</p>
                    </div>
                </div>
            `;
      })
      .join("");

    if (gastos.length > 5)
    {
      const extra = document.createElement("div");
      extra.style.cssText = "text-align: center; margin-top: 12px;";
      extra.innerHTML = `
                <a href="relatorios.php" style="
                    color: var(--air-force-blue); font-size: 0.85rem; font-weight: 600;
                    text-decoration: none; transition: all 0.3s;
                " onmouseover="this.style.color='var(--texto-secundario)'" onmouseout="this.style.color='var(--air-force-blue)'">
                    Ver todos os registros <i class="fas fa-arrow-right" style="margin-left: 4px;"></i>
                </a>
            `;
      activityList.appendChild(extra);
    }

  }

  if (btnEditarPerfil)
  {
    btnEditarPerfil.addEventListener("click", () => {
      const userData = Auth.getCurrentUser();

      if (!userData) return;

      editNome.value = userData.nome || "";

      if (editEmail) editEmail.value = userData.email || "";
      editBio.value = userData.bio || "";
      editCidade.value = userData.cidade || "";
      editProfissao.value = userData.profissao || "";
      editWebsite.value = userData.website || "";
      editTelefone.value = userData.telefone || "";
      editDataNascimento.value = userData.data_nascimento || "";

      atualizarHint(editNome, hintNome, 50);
      atualizarHint(editBio, hintBio, 160);

      modalEditar.classList.add("ativo");
    });
  }

  if (btnFecharModal)
  {
    btnFecharModal.addEventListener("click", () => {
      modalEditar.classList.remove("ativo");
    });
  }

  if (btnCancelarEditar)
  {
    btnCancelarEditar.addEventListener("click", () => {
      modalEditar.classList.remove("ativo");
    });
  }

  if (modalEditar)
  {
    modalEditar.addEventListener("click", (e) => {

      if (e.target === modalEditar)
      {
        modalEditar.classList.remove("ativo");
      }

    });
  }

  function atualizarHint(input, hint, max)
  {
    hint.textContent = `${input.value.length}/${max}`;
  }

  if (editNome)
  {
    editNome.addEventListener("input", () => {
      atualizarHint(editNome, hintNome, 50);
    });
  }

  if (editBio)
  {
    editBio.addEventListener("input", () => {
      atualizarHint(editBio, hintBio, 160);
    });
  }

  if (formEditar)
  {
    formEditar.addEventListener("submit", async (e) => {
      e.preventDefault();

      if (!editNome.value.trim())
      {
        Swal.fire("Erro", "Nome é obrigatório.", "error");
        return;
      }

      if (editNome.value.trim().length < 3)
      {
        Swal.fire("Erro", "Nome deve ter no mínimo 3 caracteres.", "error");
        return;
      }

      if (editWebsite.value && !validarURL(editWebsite.value))
      {
        Swal.fire("Erro", "Website deve ser uma URL válida.", "error");
        return;
      }

      try
      {
        const result = await Auth.updateProfile({
          nome: editNome.value.trim(),
          bio: editBio.value.trim(),
          cidade: editCidade.value.trim(),
          profissao: editProfissao.value.trim(),
          website: editWebsite.value.trim(),
          telefone: editTelefone.value.trim(),
          data_nascimento: editDataNascimento.value,
        });

        if (result.success)
        {
          Swal.fire("Sucesso ", "Perfil atualizado com sucesso!", "success");
          carregarDadosUsuario();
          modalEditar.classList.remove("ativo");
        }
        else
        {
          Swal.fire("Erro", `${result.message}`, "error");
        }

      }

      catch (err)
      {
        Swal.fire("Erro", "Falha ao atualizar perfil.", "error");
      }

    });
  }

  function validarEmail(email)
  {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarURL(url)
  {
    try
    {
      new URL(url);
      return true;
    }

    catch (err)
    {
      return false;
    }

  }

  const btnSalvarCrop = document.getElementById("btn-salvar-crop");

  if (btnSalvarCrop)
  {
    btnSalvarCrop.addEventListener("click", function () {
      setTimeout(() => {
        carregarDadosUsuario();

        const userData = Auth.getCurrentUser();

        if (userData) atualizarAvatarModal(userData);
      }, 500);
    });
  }

  if (senhaToggle && senhaFields && senhaToggleIcon)
  {
    senhaToggle.addEventListener("click", () => {
      const isOpen = senhaFields.classList.toggle("open");
      senhaToggleIcon.classList.toggle("rotated", isOpen);
    });
  }

  if (btnAlterarSenha)
  {
    btnAlterarSenha.addEventListener("click", async () => {
      const $ = (id) => document.getElementById(id);
      const senhaAtual = $("editSenhaAtual")?.value || "";
      const novaSenha = $("editNovaSenha")?.value || "";
      const confirmar = $("editConfirmarSenha")?.value || "";

      if (!senhaAtual || !novaSenha || !confirmar)
      {
        Swal.fire("Atenção", "Preencha todos os campos de senha.", "warning");
        return;
      }

      if (novaSenha.length < 6)
      {
        Swal.fire(
          "Atenção",
          "A nova senha deve ter no mínimo 6 caracteres.",
          "warning",
        );
        return;
      }

      if (novaSenha !== confirmar)
      {
        Swal.fire(
          "Erro",
          "A nova senha e a confirmação não coincidem.",
          "error",
        );
        return;
      }

      btnAlterarSenha.disabled = true;
      btnAlterarSenha.textContent = "Alterando...";

      try
      {
        const res = await fetch(`${API_BASE}/usuarios/alterar-senha.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            senha_atual: senhaAtual,
            nova_senha: novaSenha,
            confirmar_senha: confirmar,
          }),
        });
        const result = await res.json();

        if (result.success)
        {
          $("editSenhaAtual").value = "";
          $("editNovaSenha").value = "";
          $("editConfirmarSenha").value = "";

          if (senhaFields) senhaFields.classList.remove("open");

          if (senhaToggleIcon) senhaToggleIcon.classList.remove("rotated");
          Swal.fire({ title: "Sucesso!", text: result.message, imageUrl: (location.pathname.includes("/pages/") ? "../assets" : "assets") + "/img/extras/sticker.png", imageWidth: 150, imageHeight: 150, imageAlt: "Mascote da Victória", confirmButtonColor: "var(--cor-botao)" });
        }
        else
        {
          Swal.fire("Erro", result.message, "error");
        }

      }

      catch (err)
      {
        Swal.fire("Erro", "Erro de conexão com o servidor.", "error");
      }
      finally
      {
        btnAlterarSenha.disabled = false;
        btnAlterarSenha.innerHTML =
          '<i class="fas fa-check"></i> Alterar Senha';
      }

    });
  }

  const btnAlterarEmail = document.getElementById("btnAlterarEmail");
  const cadastroEmail = document.getElementById("cadastroEmail");
  const cadastroSenhaAtual = document.getElementById("cadastroSenhaAtual");

  if (btnAlterarEmail)
  {
    btnAlterarEmail.addEventListener("click", async () => {
      const novoEmail = cadastroEmail?.value.trim() || "";
      const senhaAtual = cadastroSenhaAtual?.value || "";

      if (!novoEmail)
      {
        Swal.fire("Atenção", "Informe o novo e-mail.", "warning");
        return;
      }

      if (!validarEmail(novoEmail))
      {
        Swal.fire("Erro", "Formato de e-mail inválido.", "error");
        return;
      }

      if (!senhaAtual)
      {
        Swal.fire("Atenção", "Informe sua senha atual.", "warning");
        return;
      }

      btnAlterarEmail.disabled = true;
      btnAlterarEmail.textContent = "Alterando...";

      try
      {
        const result = await Auth.updateProfile({
          email: novoEmail,
          senha_atual: senhaAtual,
        });

        if (result.success)
        {
          cadastroEmail.value = "";
          cadastroSenhaAtual.value = "";
          Swal.fire("Sucesso!", "E-mail alterado com sucesso!", "success");
          carregarDadosUsuario();
        }
        else
        {
          Swal.fire("Erro", result.message, "error");
        }

      }

      catch (err)
      {
        Swal.fire("Erro", "Erro de conexão com o servidor.", "error");
      }
      finally
      {
        btnAlterarEmail.disabled = false;
        btnAlterarEmail.innerHTML = '<i class="fas fa-check"></i> Mudar E-mail';
      }

    });
  }

  const btnDeletarConta = document.getElementById("btnDeletarConta");

  if (btnDeletarConta)
  {
    const userData = Auth.getCurrentUser();

    if (userData && parseInt(userData.tipo_usuario) >= 2)
    {
      btnDeletarConta.disabled = true;
      btnDeletarConta.title =
        "Administradores não podem excluir a própria conta pelo perfil.";
    }

    btnDeletarConta.addEventListener("click", () => {

      if (btnDeletarConta.disabled)
      {
        Swal.fire(
          "Ação não permitida",
          "Administradores não podem excluir a própria conta pelo perfil.",
          "warning",
        );
        return;
      }

      Swal.fire({
        title: "Excluir minha conta?",
        html: `
                    <p style="margin:0 0 14px;color:var(--cor-perigo);font-size:0.88rem;">Esta ação é permanente. Seus gastos e notícias serão apagados.</p>
                    <input type="password" id="swalSenhaDeletar" class="dash-field" style="width:100%;text-align:center;" placeholder="Confirme sua senha atual" autocomplete="off">
                `,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#b34700",
        confirmButtonText: "Entendo que minha conta será apagada",
        cancelButtonText: "Voltar",
        cancelButtonColor: "#aec3b0",
        preConfirm: async () => {
          const senha = document.getElementById("swalSenhaDeletar").value;

          if (!senha)
          {
            Swal.showValidationMessage("Informe sua senha atual");
            return false;
          }

          try
          {
            const res = await fetch(`${API_BASE}/usuarios/deletar.php`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ senha_atual: senha }),
            });
            const json = await res.json();

            if (!json.success)
            {
              Swal.showValidationMessage(
                json.message || "Não foi possível excluir a conta",
              );
              return false;
            }

            return true;
          }

          catch (err)
          {
            Swal.showValidationMessage("Erro de conexão com o servidor.");
            return false;
          }

        },
      }).then((result) => {

        if (result.isConfirmed)
        {
          localStorage.removeItem("victoria_user");
          window.location.href = "login.php";
        }

      });
    });
  }

  const metasDefineBtn = document.getElementById("metasDefineBtn");

  if (metasDefineBtn)
  {
    metasDefineBtn.addEventListener("click", abrirModalMetaPerfil);
  }

  document.addEventListener("victoria:tema", () => {
    carregarEstatisticas(Auth.getCurrentUser());
  });

  carregarWallpaper();
  carregarDadosUsuario();
});

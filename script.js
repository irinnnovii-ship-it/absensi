
// ==================================
// FUNGSI NOTIFIKASI
// ==================================

function tampilkanNotifikasi(judul, pesan, tipe = "success") {

    const notifikasiLama = document.querySelector(".notification");

    if (notifikasiLama) {
        notifikasiLama.remove();
    }

    const notifikasi = document.createElement("div");

    notifikasi.className = `notification ${tipe}`;

    const ikon = tipe === "success" ? "✅" : "❌";

    notifikasi.innerHTML = `
        <div class="notification-icon">${ikon}</div>

        <div class="notification-content">
            <h4>${judul}</h4>
            <p>${pesan}</p>
        </div>
    `;

    document.body.appendChild(notifikasi);

    setTimeout(function() {

        notifikasi.style.animation = "slideOut 0.4s ease forwards";

        setTimeout(function() {
            notifikasi.remove();
        }, 400);

    }, 3000);
}

// ==================================
// PENGATURAN LOGIN
// ==================================

const loginForm = document.getElementById("loginForm");

if (loginForm) {

    // Cek apakah sudah login
    if (sessionStorage.getItem("sudahLogin") === "true") {
        window.location.href = "dashboard.html";
    }

    loginForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const username = document.getElementById("username").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("loginMessage");

        if (username === "syela" && password === "123456") {

            sessionStorage.setItem("sudahLogin", "true");

            window.location.href = "dashboard.html";

        } else {

            message.textContent =
                "Username atau password salah! Silakan coba lagi.";
        }
    });
}


// ==================================
// CEK LOGIN DASHBOARD
// ==================================

function tampilkanModal(judul, pesan, ikon, teksTombol, aksi) {

    if (document.querySelector(".modal-overlay")) return;

    const modal = document.createElement("div");

    modal.className = "modal-overlay";

    modal.innerHTML = `
        <div class="modal-box">
            <div class="modal-icon">${ikon}</div>
            <h2>${judul}</h2>
            <p>${pesan}</p>

            <div class="modal-buttons">
                <button type="button" class="cancel-delete">Batal</button>
                <button type="button" class="confirm-delete">
                    ${teksTombol}
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".cancel-delete").onclick = function() {
        modal.remove();
    };

    modal.querySelector(".confirm-delete").onclick = function() {
        modal.remove();
        aksi();
    };

    modal.onclick = function(e) {
        if (e.target === modal) modal.remove();
    };
}
const attendanceForm = document.getElementById("attendanceForm");

if (attendanceForm) {

    if (sessionStorage.getItem("sudahLogin") !== "true") {
        window.location.href = "index.html";
    }

    // ==================================
    // DAFTAR KELAS OTOMATIS
    // ==================================

const kelasSelect = document.getElementById("kelas");
const filterKelas = document.getElementById("filterKelas");

const daftarKelas = [];

const tingkatan = ["X", "XI", "XII"];
const jurusan = ["PPLG", "DKV", "TKJ"];

tingkatan.forEach(function(tingkat) {

    jurusan.forEach(function(jurusanNama) {

        for (let i = 1; i <= 3; i++) {

            daftarKelas.push(
                `${tingkat} ${jurusanNama} ${i}`
            );

        }

    });

});

// Masukkan kelas ke pilihan form absensi
daftarKelas.forEach(function(kelas) {

    const option = document.createElement("option");

    option.value = kelas;
    option.textContent = kelas;

    kelasSelect.appendChild(option);

    // Masukkan juga ke filter kelas
    const filterOption = document.createElement("option");

    filterOption.value = kelas;
    filterOption.textContent = kelas;

    filterKelas.appendChild(filterOption);

});



    // ==================================
    // TANGGAL HARI INI
    // ==================================

    const tanggalSekarang = new Date();

    const tahun = tanggalSekarang.getFullYear();

    const bulan = String(
        tanggalSekarang.getMonth() + 1
    ).padStart(2, "0");

    const hari = String(
        tanggalSekarang.getDate()
    ).padStart(2, "0");

    const tanggalHariIni = `${tahun}-${bulan}-${hari}`;

    document.getElementById("tanggal").value = tanggalHariIni;

    document.getElementById("tanggal").max = tanggalHariIni;

    document.getElementById("todayDate").textContent =
        "📅 " + tanggalSekarang.toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });


    // ==================================
    // PENYIMPANAN DATA
    // ==================================

    let dataAbsensi = [];

    try {

        dataAbsensi = JSON.parse(
            localStorage.getItem("dataAbsensi")
        ) || [];

    } catch (error) {

        dataAbsensi = [];

    }


    // ==================================
    // SIMPAN DATA ABSENSI
    // ==================================

    attendanceForm.addEventListener("submit", function(e) {

        e.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const nisn = document.getElementById("nisn").value.trim();
        const kelas = document.getElementById("kelas").value;
        const tanggal = document.getElementById("tanggal").value;
        const status = document.getElementById("status").value;

        if (!/^\d{10}$/.test(nisn)) {

            alert("NISN harus terdiri dari 10 angka!");
            return;

        }

        if (tanggal > tanggalHariIni) {

            alert("Tanggal absensi tidak boleh di masa depan!");
            return;

        }

        // Cek data ganda
        const dataGanda = dataAbsensi.some(function(data) {

            return data.nisn === nisn &&
                   data.tanggal === tanggal;

        });

        if (dataGanda) {

            alert("Siswa ini sudah memiliki data absensi pada tanggal tersebut!");
            return;

        }

        const dataBaru = {

            id: Date.now() + Math.random(),
            nama: nama,
            nisn: nisn,
            kelas: kelas,
            tanggal: tanggal,
            status: status

        };

        dataAbsensi.push(dataBaru);

        localStorage.setItem(
            "dataAbsensi",
            JSON.stringify(dataAbsensi)
        );

        tampilkanNotifikasi(
    "Absensi Berhasil!",
    "Data absensi siswa berhasil disimpan.",
    "success"
);

        attendanceForm.reset();

        document.getElementById("tanggal").value = tanggalHariIni;

        tampilkanData();

    });


    // ==================================
    // FUNGSI ESCAPE HTML
    // ==================================

    function escapeHTML(teks) {

        return String(teks).replace(/[&<>"']/g, function(karakter) {

            const simbol = {

                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"

            };

            return simbol[karakter];

        });

    }


    // ==================================
    // FORMAT TANGGAL
    // ==================================

    function formatTanggal(tanggal) {

        const bagian = tanggal.split("-");

        return `${bagian[2]}/${bagian[1]}/${bagian[0]}`;

    }


    // ==================================
    // MENAMPILKAN DATA ABSENSI
    // ==================================

    function tampilkanData() {

        const tabel = document.getElementById("attendanceTable");

        const kosong = document.getElementById("emptyMessage");

        const pencarian = document.getElementById("searchInput")
            .value.toLowerCase();

        const filter = filterKelas.value;

        const filterTanggal =
            document.getElementById("filterTanggal").value;

        const hasilFilter = dataAbsensi.filter(function(data) {

            const cocokNama =
                data.nama.toLowerCase().includes(pencarian);

            const cocokNisn =
                data.nisn.includes(pencarian);

            const cocokKelas =
                filter === "" || data.kelas === filter;

            const cocokTanggal =
                filterTanggal === "" ||
                data.tanggal === filterTanggal;

            return (cocokNama || cocokNisn) &&
                   cocokKelas &&
                   cocokTanggal;

        });

        tabel.innerHTML = "";

        if (hasilFilter.length === 0) {

            kosong.style.display = "block";

        } else {

            kosong.style.display = "none";

        }

        hasilFilter.forEach(function(data, index) {

            let statusClass = "";

            if (data.status === "Hadir") {

                statusClass = "status-hadir";
            
                } else if (data.status === "Dispen") {

                statusClass = "status-dispen";

            } else if (data.status === "Izin") {

                statusClass = "status-izin";

            } else if (data.status === "Sakit") {

                statusClass = "status-sakit";

            } else {

                statusClass = "status-alfa";

            }

            const baris = document.createElement("tr");

            baris.innerHTML = `
                <td>${index + 1}</td>
                <td>${escapeHTML(data.nama)}</td>
                <td>${escapeHTML(data.nisn)}</td>
                <td>${escapeHTML(data.kelas)}</td>
                <td>${formatTanggal(data.tanggal)}</td>
                <td>
                    <span class="status ${statusClass}">
                        ${escapeHTML(data.status)}
                    </span>
                </td>
                <td>
                    <button class="delete-btn"
                        data-id="${data.id}">
                        🗑️ Hapus
                    </button>
                </td>
            `;

            tabel.appendChild(baris);

        });

        hitungStatistik();

    }


    // ==================================
    // MENGHITUNG STATISTIK
    // ==================================

    function hitungStatistik() {

    const hadir = dataAbsensi.filter(
        data => data.status === "Hadir"
    ).length;

    const dispen = dataAbsensi.filter(
        data => data.status === "Dispen"
    ).length;

    const izin = dataAbsensi.filter(
        data => data.status === "Izin"
    ).length;

    const sakit = dataAbsensi.filter(
        data => data.status === "Sakit"
    ).length;

    const alfa = dataAbsensi.filter(
        data => data.status === "Alfa"
    ).length;

    document.getElementById("totalData").textContent =
        dataAbsensi.length;

    document.getElementById("totalHadir").textContent =
        hadir + dispen;

    document.getElementById("totalIzinSakit").textContent =
        izin + sakit;

    document.getElementById("totalAlfa").textContent =
        alfa;
}

// ==================================
// MODAL KONFIRMASI ESTETIK
// ==================================

function tampilkanModal(judul, pesan, ikon, teksTombol, aksi) {

    // Cegah modal muncul dua kali
    if (document.querySelector(".modal-overlay")) return;

    const modal = document.createElement("div");

    modal.className = "modal-overlay";

    modal.innerHTML = `
        <div class="modal-box">

            <div class="modal-icon">${ikon}</div>

            <h2>${judul}</h2>

            <p>${pesan}</p>

            <div class="modal-buttons">

                <button type="button" class="cancel-delete">
                    Batal
                </button>

                <button type="button" class="confirm-delete">
                    ${teksTombol}
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(modal);

    // Tombol batal
    modal.querySelector(".cancel-delete")
        .addEventListener("click", function() {
            modal.remove();
        });

    // Klik area luar modal
    modal.addEventListener("click", function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Tombol konfirmasi
    modal.querySelector(".confirm-delete")
        .addEventListener("click", function() {
            modal.remove();
            aksi();
        });

}


// ==================================
// EVENT HAPUS DATA ABSENSI
// ==================================

document.getElementById("attendanceTable")
    .addEventListener("click", function(e) {

        const tombol = e.target.closest(".delete-btn");

        if (!tombol) return;

        const id = tombol.dataset.id;

        tampilkanModal(
            "Hapus Data Absensi?",
            "Apakah kamu yakin ingin menghapus data absensi ini? Data yang sudah dihapus tidak dapat dikembalikan.",
            "🗑️",
            "Ya, Hapus",
            function() {

                dataAbsensi = dataAbsensi.filter(function(data) {
                    return String(data.id) !== String(id);
                });

                localStorage.setItem(
                    "dataAbsensi",
                    JSON.stringify(dataAbsensi)
                );

                tampilkanData();

                tampilkanNotifikasi(
                    "Berhasil Dihapus!",
                    "Data absensi berhasil dihapus.",
                    "success"
                );

            }
        );

    });

    // ==================================
    // PENCARIAN DAN FILTER
    // ==================================

    document.getElementById("searchInput")
        .addEventListener("input", tampilkanData);

    filterKelas.addEventListener("change", tampilkanData);

    document.getElementById("filterTanggal")
        .addEventListener("change", tampilkanData);


    // ==================================
    // TAMPILKAN DATA SAAT DASHBOARD DIBUKA
    // ==================================

    tampilkanData();

}


// ==================================
// LOGOUT DENGAN MODAL ESTETIK
// ==================================

function logout() {

    tampilkanModal(
        "Keluar dari Dashboard?",
        "Apakah kamu yakin ingin keluar dari sistem absensi siswa?",
        "👋",
        "Ya, Keluar",
        function() {

            sessionStorage.removeItem("sudahLogin");

            tampilkanNotifikasi(
                "Berhasil Keluar!",
                "Kamu telah keluar dari sistem.",
                "success"
            );

            setTimeout(function() {
                window.location.href = "index.html";
            }, 800);

        }
    );

}

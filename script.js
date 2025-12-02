// --- NEW FEATURES START: GLOBAL DATA & STATE ---

// Settings Default Configuration
const SETTINGS_DEFAULT = {
    theme: 'system',
    effectsEnabled: true,
    editorFontSize: 14,
    editorFontFamily: 'Fira Code',
    editorLigatures: true,
    autoFormatMode: 'off',
    aiModel: 'gemini_flash',
    resultView: 'table',
    erdMode: 'full',
    lowPowerMode: false,
    language: 'vi',
    highContrast: false,
    uiScale: 'normal',
    autosaveEnabled: true
};

// Current Settings State
let APP_SETTINGS = { ...SETTINGS_DEFAULT };

const USER_STATE = {
    level: 1,
    xp: 0,
    completedExercises: []
};

const DATASETS = {
    school: {
        name: 'school_db',
        display: 'Trường Học',
        initSQL: [
            "CREATE TABLE IF NOT EXISTS Lop (MaLop STRING, TenLop STRING)",
            "CREATE TABLE IF NOT EXISTS SinhVien (MaSV STRING, HoTen STRING, NgaySinh DATE, GioiTinh STRING, MaLop STRING, DiemTB FLOAT)",
            "INSERT INTO Lop VALUES ('L01', 'CNTT K15'), ('L02', 'Kinh Te K15'), ('L03', 'Ngon Ngu Anh')",
            "INSERT INTO SinhVien VALUES ('SV01', 'Nguyen Van An', '2003-01-01', 'Nam', 'L01', 8.5), ('SV02', 'Tran Thi Binh', '2003-05-12', 'Nu', 'L01', 9.0), ('SV03', 'Le Van Cuong', '2002-11-20', 'Nam', 'L02', 6.5), ('SV04', 'Pham My Duyen', '2003-08-15', 'Nu', 'L02', 7.0), ('SV05', 'Hoang Van Em', '2003-02-10', 'Nam', 'L01', 5.0)"
        ]
    },
    ecommerce: {
        name: 'ecommerce_db',
        display: 'Thương Mại ĐT',
        initSQL: [
            "CREATE TABLE IF NOT EXISTS Users (UserID INT, Name STRING, Country STRING, JoinDate DATE)",
            "CREATE TABLE IF NOT EXISTS Products (ProductID INT, Name STRING, Price FLOAT, Category STRING)",
            "CREATE TABLE IF NOT EXISTS Orders (OrderID INT, UserID INT, ProductID INT, Amount INT, OrderDate DATE)",
            "INSERT INTO Users VALUES (1, 'Alice', 'USA', '2023-01-01'), (2, 'Bob', 'UK', '2023-02-15'), (3, 'Charlie', 'USA', '2023-03-10')",
            "INSERT INTO Products VALUES (101, 'Laptop', 1000, 'Electronics'), (102, 'Mouse', 20, 'Electronics'), (103, 'Shirt', 30, 'Apparel')",
            "INSERT INTO Orders VALUES (1, 1, 101, 1, '2023-05-01'), (2, 1, 102, 2, '2023-05-02'), (3, 2, 103, 5, '2023-05-05'), (4, 3, 101, 1, '2023-06-01')"
        ]
    },
    hr: {
        name: 'hr_db',
        display: 'Nhân Sự',
        initSQL: [
            "CREATE TABLE IF NOT EXISTS Departments (DeptID INT, DeptName STRING)",
            "CREATE TABLE IF NOT EXISTS Employees (EmpID INT, Name STRING, DeptID INT, Salary INT, HireDate DATE)",
            "INSERT INTO Departments VALUES (1, 'IT'), (2, 'HR'), (3, 'Sales')",
            "INSERT INTO Employees VALUES (1, 'John Doe', 1, 5000, '2020-01-01'), (2, 'Jane Smith', 1, 6000, '2019-05-15'), (3, 'Mike Ross', 2, 4500, '2021-08-01'), (4, 'Rachel Zane', 3, 5500, '2020-11-20'), (5, 'Harvey Specter', 3, 9000, '2018-02-01')"
        ]
    }
};

const EXERCISES = [
    // --- BASIC (15 items) ---
    { id: 'b1', level: 'Basic', title: 'Chọn tất cả sinh viên', desc: 'Lấy tất cả thông tin từ bảng `SinhVien`.', dataset: 'school', solution: "SELECT * FROM SinhVien", check: (r)=>r.length==5 && r[0].HoTen },
    { id: 'b2', level: 'Basic', title: 'Lọc sinh viên Nam', desc: 'Lấy danh sách sinh viên có giới tính là `Nam`.', dataset: 'school', solution: "SELECT * FROM SinhVien WHERE GioiTinh = 'Nam'", check: (r)=>r.length==3 && r.every(x=>x.GioiTinh=='Nam') },
    { id: 'b3', level: 'Basic', title: 'Sinh viên điểm cao', desc: 'Lấy tên và điểm của sinh viên có điểm trung bình > 8.0.', dataset: 'school', solution: "SELECT HoTen, DiemTB FROM SinhVien WHERE DiemTB > 8.0", check: (r)=>r.length==2 && !r[0].MaSV },
    { id: 'b4', level: 'Basic', title: 'Sắp xếp theo điểm', desc: 'Lấy danh sách sinh viên sắp xếp theo điểm trung bình giảm dần.', dataset: 'school', solution: "SELECT * FROM SinhVien ORDER BY DiemTB DESC", check: (r)=>r[0].DiemTB >= r[1].DiemTB },
    { id: 'b5', level: 'Basic', title: 'Tìm sản phẩm giá rẻ', desc: 'Lấy tên sản phẩm có giá dưới 50 từ bảng `Products`.', dataset: 'ecommerce', solution: "SELECT Name FROM Products WHERE Price < 50", check: (r)=>r.length>=2 },
    { id: 'b6', level: 'Basic', title: 'Khách hàng USA', desc: 'Lấy tên khách hàng đến từ `USA`.', dataset: 'ecommerce', solution: "SELECT Name FROM Users WHERE Country = 'USA'", check: (r)=>r.length==2 },
    { id: 'b7', level: 'Basic', title: 'Nhân viên lương cao', desc: 'Lấy tên nhân viên có lương >= 6000.', dataset: 'hr', solution: "SELECT Name FROM Employees WHERE Salary >= 6000", check: (r)=>r.length==2 },
    { id: 'b8', level: 'Basic', title: 'Tìm theo tên', desc: 'Lấy nhân viên có tên chứa chữ `Jane`.', dataset: 'hr', solution: "SELECT * FROM Employees WHERE Name LIKE '%Jane%'", check: (r)=>r.length==1 },
    { id: 'b9', level: 'Basic', title: 'Top 3 sinh viên', desc: 'Lấy 3 sinh viên đầu tiên trong danh sách.', dataset: 'school', solution: "SELECT * FROM SinhVien LIMIT 3", check: (r)=>r.length==3 },
    { id: 'b10', level: 'Basic', title: 'Cập nhật điểm', desc: 'Viết câu lệnh UPDATE để sửa điểm của SV05 thành 6.0 (Hệ thống sẽ giả lập chạy).', dataset: 'school', solution: "UPDATE SinhVien SET DiemTB = 6.0 WHERE MaSV = 'SV05'", check: (r)=>true /* logic handled specifically */ },
    { id: 'b11', level: 'Basic', title: 'Lấy mã và tên lớp', desc: 'Chỉ lấy 2 cột `MaLop` và `TenLop` từ bảng `Lop`.', dataset: 'school', solution: "SELECT MaLop, TenLop FROM Lop", check: (r)=>r.length==3 && r[0].MaLop && !r[0].DiemTB },
    { id: 'b12', level: 'Basic', title: 'Sản phẩm đắt tiền', desc: 'Lấy thông tin sản phẩm có giá trên 500.', dataset: 'ecommerce', solution: "SELECT * FROM Products WHERE Price > 500", check: (r)=>r.length==1 },
    { id: 'b13', level: 'Basic', title: 'Nhân viên phòng IT', desc: 'Lấy danh sách nhân viên thuộc phòng ban số 1 (IT).', dataset: 'hr', solution: "SELECT * FROM Employees WHERE DeptID = 1", check: (r)=>r.length==2 },
    { id: 'b14', level: 'Basic', title: 'Xóa đơn hàng', desc: 'Viết câu lệnh DELETE để xóa đơn hàng có OrderID = 4.', dataset: 'ecommerce', solution: "DELETE FROM Orders WHERE OrderID = 4", check: (r)=>true },
    { id: 'b15', level: 'Basic', title: 'Thêm phòng ban mới', desc: 'Thêm phòng ban mới: DeptID=4, DeptName="Marketing".', dataset: 'hr', solution: "INSERT INTO Departments VALUES (4, 'Marketing')", check: (r)=>true },

    // --- INTERMEDIATE (15 items) ---
    { id: 'i1', level: 'Intermediate', title: 'Đếm số lượng SV', desc: 'Đếm tổng số sinh viên trong mỗi lớp (Group by MaLop).', dataset: 'school', solution: "SELECT MaLop, COUNT(*) as SL FROM SinhVien GROUP BY MaLop", check: (r)=>r.length>0 && r[0].SL },
    { id: 'i2', level: 'Intermediate', title: 'Điểm trung bình theo lớp', desc: 'Tính điểm trung bình chung của mỗi lớp.', dataset: 'school', solution: "SELECT MaLop, AVG(DiemTB) as DTB FROM SinhVien GROUP BY MaLop", check: (r)=>r.length>0 && r[0].DTB },
    { id: 'i3', level: 'Intermediate', title: 'Tổng chi tiêu user', desc: 'Tính tổng tiền (Price * Amount) mỗi User đã mua. Cần JOIN Users, Orders, Products.', dataset: 'ecommerce', solution: "SELECT u.Name, SUM(p.Price * o.Amount) as Total FROM Users u JOIN Orders o ON u.UserID = o.UserID JOIN Products p ON o.ProductID = p.ProductID GROUP BY u.Name", check: (r)=>r.length>0 },
    { id: 'i4', level: 'Intermediate', title: 'Lương trung bình phòng ban', desc: 'Tính lương trung bình của từng phòng ban (Hiển thị Tên phòng).', dataset: 'hr', solution: "SELECT d.DeptName, AVG(e.Salary) FROM Departments d JOIN Employees e ON d.DeptID = e.DeptID GROUP BY d.DeptName", check: (r)=>r.length>0 },
    { id: 'i5', level: 'Intermediate', title: 'Phòng ban lương cao', desc: 'Chỉ lấy những phòng ban có lương trung bình > 5000 (Dùng HAVING).', dataset: 'hr', solution: "SELECT DeptID, AVG(Salary) FROM Employees GROUP BY DeptID HAVING AVG(Salary) > 5000", check: (r)=>r.length>0 },
    { id: 'i6', level: 'Intermediate', title: 'Sinh viên chưa có lớp', desc: 'Tìm sinh viên không thuộc lớp nào (giả sử có, dùng LEFT JOIN check NULL). Ở data mẫu hiện tại đều có lớp, hãy viết query đúng logic.', dataset: 'school', solution: "SELECT s.HoTen FROM SinhVien s LEFT JOIN Lop l ON s.MaLop = l.MaLop WHERE l.MaLop IS NULL", check: (r)=>Array.isArray(r) },
    { id: 'i7', level: 'Intermediate', title: 'Sản phẩm chưa bán được', desc: 'Tìm tên sản phẩm chưa từng xuất hiện trong đơn hàng nào (Subquery NOT IN).', dataset: 'ecommerce', solution: "SELECT Name FROM Products WHERE ProductID NOT IN (SELECT ProductID FROM Orders)", check: (r)=>r.length>0 },
    { id: 'i8', level: 'Intermediate', title: 'Đơn hàng giá trị lớn', desc: 'Liệt kê các đơn hàng có tổng giá trị > 50.', dataset: 'ecommerce', solution: "SELECT o.OrderID FROM Orders o JOIN Products p ON o.ProductID = p.ProductID WHERE (p.Price * o.Amount) > 50", check: (r)=>r.length>0 },
    { id: 'i9', level: 'Intermediate', title: 'Nhân viên lương cao nhất', desc: 'Tìm nhân viên có lương cao nhất công ty.', dataset: 'hr', solution: "SELECT Name FROM Employees WHERE Salary = (SELECT MAX(Salary) FROM Employees)", check: (r)=>r.length==1 && r[0].Name.includes('Harvey') },
    { id: 'i10', level: 'Intermediate', title: 'Xếp hạng lương (Window)', desc: 'Sử dụng RANK() hoặc DENSE_RANK() để xếp hạng lương nhân viên giảm dần.', dataset: 'hr', solution: "SELECT Name, Salary, RANK() OVER (ORDER BY Salary DESC) as Rnk FROM Employees", check: (r)=>r[0].Rnk === 1 },
    { id: 'i11', level: 'Intermediate', title: 'Doanh thu theo danh mục', desc: 'Tính tổng doanh thu bán hàng theo từng danh mục sản phẩm (Category).', dataset: 'ecommerce', solution: "SELECT p.Category, SUM(p.Price * o.Amount) as Revenue FROM Products p JOIN Orders o ON p.ProductID = o.ProductID GROUP BY p.Category", check: (r)=>r.length>0 },
    { id: 'i12', level: 'Intermediate', title: 'Sinh viên giỏi nhất lớp', desc: 'Tìm sinh viên có điểm cao nhất trong mỗi lớp.', dataset: 'school', solution: "SELECT * FROM SinhVien s1 WHERE DiemTB = (SELECT MAX(DiemTB) FROM SinhVien s2 WHERE s2.MaLop = s1.MaLop)", check: (r)=>r.length>0 },
    { id: 'i13', level: 'Intermediate', title: 'Nhân viên thâm niên', desc: 'Tìm nhân viên đã làm việc trên 3 năm (tính đến 2024).', dataset: 'hr', solution: "SELECT * FROM Employees WHERE HireDate <= '2021-01-01'", check: (r)=>r.length>0 },
    { id: 'i14', level: 'Intermediate', title: 'Khách hàng VIP', desc: 'Tìm khách hàng đã mua tổng cộng trên 100 đơn vị tiền tệ.', dataset: 'ecommerce', solution: "SELECT u.Name FROM Users u JOIN Orders o ON u.UserID = o.UserID JOIN Products p ON o.ProductID = p.ProductID GROUP BY u.UserID, u.Name HAVING SUM(p.Price * o.Amount) > 100", check: (r)=>r.length>0 },
    { id: 'i15', level: 'Intermediate', title: 'Lớp đông nhất', desc: 'Tìm tên lớp có số lượng sinh viên đông nhất.', dataset: 'school', solution: "SELECT l.TenLop FROM Lop l JOIN SinhVien s ON l.MaLop = s.MaLop GROUP BY l.TenLop ORDER BY COUNT(*) DESC LIMIT 1", check: (r)=>r.length==1 }
];

// ... (Existing data and state variables) ...

// ... (Existing functions: Auth, Closure, AI, etc.) ...
// --- 4. APP STATE ---
let CURRENT_USER = null; // { username: string, xp: int, level: int, completed: [] }
let CURRENT_EX_IDX = -1;

// --- 5. AUTH SYSTEM (LocalStorage) ---
function initAuth() {
    const userStr = localStorage.getItem('sql_master_current_user');
    if (userStr) {
        CURRENT_USER = JSON.parse(userStr);
        renderLoggedInUI();
    } else {
        renderLoggedOutUI();
    }
}

let authMode = 'login';
function openAuthModal(mode) {
    authMode = mode;
    document.getElementById('auth-modal').classList.remove('hidden');
    document.getElementById('auth-title').innerText = mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký';
    document.getElementById('auth-submit-btn').innerText = mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký';
    document.getElementById('auth-switch-text').innerHTML = mode === 'login' 
        ? `Chưa có tài khoản? <button onclick="toggleAuthMode()" class="text-indigo-600 font-bold hover:underline">Đăng ký ngay</button>`
        : `Đã có tài khoản? <button onclick="toggleAuthMode()" class="text-indigo-600 font-bold hover:underline">Đăng nhập</button>`;
}

function closeAuthModal() {
    document.getElementById('auth-modal').classList.add('hidden');
}

function toggleAuthMode() {
    openAuthModal(authMode === 'login' ? 'register' : 'login');
}

function handleAuthSubmit() {
    const u = document.getElementById('auth-username').value.trim();
    const p = document.getElementById('auth-password').value.trim();
    if (!u || !p) return alert("Vui lòng nhập đầy đủ thông tin.");

    const dbUsers = JSON.parse(localStorage.getItem('sql_master_users') || '{}');

    if (authMode === 'register') {
        if (dbUsers[u]) return alert("Username đã tồn tại.");
        const newUser = { username: u, password: p, xp: 0, level: 1, completed: [] };
        dbUsers[u] = newUser;
        localStorage.setItem('sql_master_users', JSON.stringify(dbUsers));
        // Auto login
        loginUser(newUser);
    } else {
        if (!dbUsers[u] || dbUsers[u].password !== p) return alert("Sai tài khoản hoặc mật khẩu.");
        loginUser(dbUsers[u]);
    }
    closeAuthModal();
}

function loginUser(userObj) {
    CURRENT_USER = userObj;
    localStorage.setItem('sql_master_current_user', JSON.stringify(CURRENT_USER));
    renderLoggedInUI();
    initExercises(); // Refresh progress UI
    showToast(`Xin chào, ${userObj.username}!`);
}

function logout() {
    // Save latest state before logout just in case
    if (CURRENT_USER) {
        const dbUsers = JSON.parse(localStorage.getItem('sql_master_users') || '{}');
        dbUsers[CURRENT_USER.username] = CURRENT_USER;
        localStorage.setItem('sql_master_users', JSON.stringify(dbUsers));
    }
    localStorage.removeItem('sql_master_current_user');
    CURRENT_USER = null;
    renderLoggedOutUI();
    initExercises();
    showToast("Đã đăng xuất.");
}

function renderLoggedInUI() {
    document.getElementById('logged-out-view').classList.add('hidden');
    document.getElementById('logged-in-view').classList.remove('hidden');
    document.getElementById('username-display').innerText = CURRENT_USER.username;
    updateGamificationUI();
}

function renderLoggedOutUI() {
    document.getElementById('logged-out-view').classList.remove('hidden');
    document.getElementById('logged-in-view').classList.add('hidden');
}

function updateGamificationUI() {
    if (!CURRENT_USER) return;
    document.getElementById('user-lvl').innerText = CURRENT_USER.level;
    document.getElementById('user-xp').innerText = CURRENT_USER.xp;
    const progress = (CURRENT_USER.xp % 100); 
    document.getElementById('xp-bar').style.width = `${progress}%`;
}

function addXP(amount) {
    if (!CURRENT_USER) return;
    CURRENT_USER.xp += amount;
    const newLvl = 1 + Math.floor(CURRENT_USER.xp / 100);
    if (newLvl > CURRENT_USER.level) {
        showToast(`🎉 CHÚC MỪNG! LÊN LEVEL ${newLvl}`);
        CURRENT_USER.level = newLvl;
    }
    updateGamificationUI();
    // Sync to DB
    const dbUsers = JSON.parse(localStorage.getItem('sql_master_users') || '{}');
    dbUsers[CURRENT_USER.username] = CURRENT_USER;
    localStorage.setItem('sql_master_users', JSON.stringify(dbUsers));
    localStorage.setItem('sql_master_current_user', JSON.stringify(CURRENT_USER));
}

// --- 6. CORE LOGIC (DB & Exercises) ---
function initApp() {
    loadSettings(); // Load user settings first
    initAuth();
    loadSampleDataset('school'); // Default
    initExercises();
    initPrintableExercises(); // Prepare print view
    setupAutosave(); // Setup autosave listeners
    restoreAutosavedContent(); // Restore any saved editor content
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        if (APP_SETTINGS.theme === 'system') {
            applyTheme('system');
        }
    });
}

// Dataset Loader with DROP fix
function loadSampleDataset(key) {
    const ds = DATASETS[key];
    if(!ds) return;
    const dbName = ds.name;
    try {
        alasql(`DROP DATABASE IF EXISTS ${dbName}`);
        alasql(`CREATE DATABASE ${dbName}`);
        alasql(`USE ${dbName}`);
        ds.initSQL.forEach(q => alasql(q));
        refreshSchemaViewer();
        showToast(`Đã nạp: ${ds.display}`);
        updateDBSelector(dbName);
    } catch(e) { console.error(e); alert("Lỗi tải data: " + e.message); }
}

function updateDBSelector(activeDB) {
    const sel = document.getElementById('db-selector');
    const dbs = alasql('SHOW DATABASES');
    sel.innerHTML = '';
    dbs.forEach(db => {
        const opt = document.createElement('option');
        opt.value = db.databaseid;
        opt.text = db.databaseid;
        if(db.databaseid === activeDB) opt.selected = true;
        sel.appendChild(opt);
    });
}

function switchDB(dbName) {
    try {
        alasql(`USE ${dbName}`);
        refreshSchemaViewer();
    } catch(e) {
        alert("Không thể chuyển Database: " + e.message);
    }
}

function refreshSchemaViewer() {
    const container = document.getElementById('schema-container');
    container.innerHTML = '';
    const currentDb = alasql.useid;
    const tables = alasql(`SHOW TABLES FROM ${currentDb}`);
    
    if(tables.length === 0) {
        container.innerHTML = '<div class="text-xs text-slate-400 p-2 italic">Trống</div>'; 
        return;
    }

    tables.forEach(t => {
        const cols = alasql(`SHOW COLUMNS FROM ${t.tableid}`);
        const colsHtml = cols.map(c => 
            `<div class="flex items-center gap-1 text-[10px] text-slate-500 pl-2">
                <span class="material-symbols-outlined text-[10px] text-slate-300">remove</span> ${c.columnid} <span class="text-slate-300">${c.dbtypeid||''}</span>
            </div>`
        ).join('');

        container.innerHTML += `
            <div class="border border-slate-200 rounded bg-white overflow-hidden">
                <div class="bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-700 border-b border-slate-100 flex justify-between cursor-pointer hover:bg-slate-100" onclick="insertSampleQuery('SELECT * FROM ${t.tableid}')">
                    <span>📅 ${t.tableid}</span>
                    <span class="material-symbols-outlined text-[12px] text-slate-400">play_arrow</span>
                </div>
                <div class="p-1 space-y-0.5">${colsHtml}</div>
            </div>`;
    });
}

// Exercises
function initExercises() {
    const listEl = document.getElementById('exercise-list');
    listEl.innerHTML = '';
    const completedIds = CURRENT_USER ? CURRENT_USER.completed : [];

    const groups = { 
        'Basic': { title: 'Cơ Bản', color: 'text-green-600 bg-green-50' }, 
        'Intermediate': { title: 'Trung Cấp', color: 'text-blue-600 bg-blue-50' }, 
        'Advanced': { title: 'Nâng Cao', color: 'text-purple-600 bg-purple-50' } 
    };
    
    const groupedExercises = { 'Basic': [], 'Intermediate': [], 'Advanced': [] };
    EXERCISES.forEach(ex => {
        if (groupedExercises[ex.level]) groupedExercises[ex.level].push(ex);
    });

    for (const [level, groupData] of Object.entries(groups)) {
        if (groupedExercises[level].length > 0) {
            const details = document.createElement('details');
            details.className = 'group mb-2';
            details.open = true; // Default open
            
            const summary = document.createElement('summary');
            summary.className = `cursor-pointer p-2 font-bold rounded flex justify-between items-center text-xs uppercase tracking-wide ${groupData.color}`;
            summary.innerHTML = `${groupData.title} <span class="material-symbols-outlined text-sm transition-transform group-open:rotate-180">expand_more</span>`;
            
            const contentDiv = document.createElement('div');
            contentDiv.className = 'pl-1 mt-1 space-y-1';

            groupedExercises[level].forEach((ex) => {
                const originalIdx = EXERCISES.findIndex(e => e.id === ex.id);
                const isDone = completedIds.includes(ex.id);
                const item = document.createElement('div');
                item.className = `p-2 rounded border cursor-pointer flex justify-between items-center hover:bg-slate-50 exercise-card ${isDone ? 'border-green-200 bg-green-50/50' : 'border-slate-100'}`;
                item.onclick = () => loadExercise(originalIdx);
                
                // Active state logic handled in loadExercise
                item.setAttribute('data-ex-idx', originalIdx);

                item.innerHTML = `
                    <span class="text-xs font-medium text-slate-700 truncate flex-1 pr-2">${ex.title}</span>
                    ${isDone ? '<span class="material-symbols-outlined text-green-500 text-[16px]">check_circle</span>' : ''}
                `;
                contentDiv.appendChild(item);
            });

            details.appendChild(summary);
            details.appendChild(contentDiv);
            listEl.appendChild(details);
        }
    }
}

function initPrintableExercises() {
    const container = document.getElementById('printable-exercises');
    if(!container) return;
    let html = '<h3 class="text-xl font-bold mb-4 border-b pb-2">Danh Sách Bài Tập & Đáp Án</h3>';
    EXERCISES.forEach((ex, i) => {
        html += `
            <div class="mb-6 p-4 border border-slate-300 rounded break-inside-avoid" style="page-break-inside: avoid;">
                <div class="flex justify-between items-baseline mb-2">
                    <h4 class="font-bold text-lg">Bài ${i+1}: ${ex.title}</h4>
                    <span class="text-xs font-bold bg-slate-100 px-2 py-1 rounded border">${ex.level}</span>
                </div>
                <div class="text-sm text-slate-700 mb-2">${marked.parse(ex.desc)}</div>
                <div class="text-xs font-mono bg-slate-50 p-2 border border-slate-200 rounded">
                    <strong>Đáp án:</strong><br>
                    ${ex.solution}
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

let currentExerciseIdx = -1;

function loadExercise(idx) {
    CURRENT_EX_IDX = idx;
    const ex = EXERCISES[idx];
    
    // UI Update Highlight
    document.querySelectorAll('.exercise-card').forEach((el) => {
         // Match by data attribute
         if(parseInt(el.getAttribute('data-ex-idx')) === idx) {
             el.classList.add('border-l-4', 'border-indigo-500', 'bg-indigo-50');
         } else {
             el.classList.remove('border-l-4', 'border-indigo-500', 'bg-indigo-50');
         }
    });

    document.getElementById('exercise-empty-state').classList.add('hidden');
    document.getElementById('exercise-workspace').classList.remove('hidden');
    
    document.getElementById('ex-title').innerText = ex.title;
    document.getElementById('ex-difficulty').innerText = ex.level;
    document.getElementById('ex-desc').innerHTML = marked.parse(ex.desc);
    document.getElementById('ex-tables').innerText = "Đang nạp dữ liệu...";
    document.getElementById('ex-editor').value = '';
    document.getElementById('ex-result').innerHTML = '<div class="flex items-center justify-center h-full text-slate-400 text-xs italic">Kết quả sẽ hiện ở đây</div>';
    document.getElementById('ex-feedback').innerHTML = '';
    
    // Auto load required dataset
    loadSampleDataset(ex.dataset);
    setTimeout(() => {
        const tables = alasql(`SHOW TABLES FROM ${DATASETS[ex.dataset].name}`).map(t => t.tableid).join(', ');
        document.getElementById('ex-tables').innerText = tables;
    }, 500);
}

function showExerciseAnswer() {
    if (CURRENT_EX_IDX === -1) return;
    if (confirm("Xem đáp án sẽ không được tính điểm bài này?")) {
        document.getElementById('ex-editor').value = EXERCISES[CURRENT_EX_IDX].solution;
    }
}

function checkExercise() {
    if (CURRENT_EX_IDX === -1) return;
    const ex = EXERCISES[CURRENT_EX_IDX];
    const userSql = document.getElementById('ex-editor').value;
    const feedbackEl = document.getElementById('ex-feedback');
    const resultEl = document.getElementById('ex-result');

    try {
        const res = alasql(userSql);
        // Render Table
        let html = '<table class="sql-result-table"><thead><tr>';
        if(res.length > 0) Object.keys(res[0]).forEach(c => html += `<th>${c}</th>`);
        html += '</tr></thead><tbody>';
        res.forEach(row => {
            html += '<tr>';
            Object.values(row).forEach(v => html += `<td>${v}</td>`);
            html += '</tr>';
        });
        html += '</tbody></table>';
        resultEl.innerHTML = html;

        // Check logic
        if(ex.check(res)) {
            feedbackEl.innerHTML = '<span class="text-green-600 flex items-center gap-1"><span class="material-symbols-outlined text-lg">check_circle</span> Chính xác! +10 XP</span>';
            const completedList = CURRENT_USER ? CURRENT_USER.completed : USER_STATE.completedExercises;
            if(!completedList.includes(ex.id)) {
                completedList.push(ex.id);
                addXP(10);
                if(CURRENT_USER) {
                    // Sync to localStorage for logged-in users
                    const dbUsers = JSON.parse(localStorage.getItem('sql_master_users') || '{}');
                    dbUsers[CURRENT_USER.username] = CURRENT_USER;
                    localStorage.setItem('sql_master_users', JSON.stringify(dbUsers));
                    localStorage.setItem('sql_master_current_user', JSON.stringify(CURRENT_USER));
                } else {
                    saveUserData();
                }
                initExercises(); // Refresh UI list
            }
        } else {
            feedbackEl.innerHTML = '<span class="text-red-600 flex items-center gap-1"><span class="material-symbols-outlined text-lg">error</span> Chưa đúng. Hãy kiểm tra lại.</span>';
        }

    } catch(e) {
        feedbackEl.innerHTML = `<span class="text-red-600 font-mono text-xs">Lỗi: ${e.message}</span>`;
    }
}

// 3. GAMIFICATION (XP & PROFILE)
function loadUserData() {
    const saved = localStorage.getItem('sql_master_user');
    if(saved) {
        const parsed = JSON.parse(saved);
        USER_STATE.level = parsed.level || 1;
        USER_STATE.xp = parsed.xp || 0;
        USER_STATE.completedExercises = parsed.completedExercises || [];
    }
    updateProfileUI();
}

function saveUserData() {
    localStorage.setItem('sql_master_user', JSON.stringify(USER_STATE));
    updateProfileUI();
}

// Note: addXP is defined in the AUTH section above (line ~179)

function updateProfileUI() {
    document.getElementById('user-lvl').innerText = USER_STATE.level;
    document.getElementById('user-xp').innerText = USER_STATE.xp;
    const progress = (USER_STATE.xp % 100); 
    document.getElementById('xp-bar').style.width = `${progress}%`;
}

// 4. HINTS & EXPLAIN
function explainCurrentQuery() {
    const sql = document.getElementById('sql-editor').value;
    // Simple explain logic without AI cost
    let explanation = "<b>Phân tích nhanh:</b><br>";
    if(!sql) { alert("Hãy nhập câu lệnh trước."); return; }
    
    if(sql.toUpperCase().includes('SELECT')) explanation += "- <b>SELECT</b>: Đang lấy dữ liệu.<br>";
    if(sql.toUpperCase().includes('JOIN')) explanation += "- <b>JOIN</b>: Đang kết hợp bảng.<br>";
    if(sql.toUpperCase().includes('WHERE')) explanation += "- <b>WHERE</b>: Đang lọc điều kiện.<br>";
    if(sql.toUpperCase().includes('GROUP BY')) explanation += "- <b>GROUP BY</b>: Đang gom nhóm dữ liệu.<br>";
    
    showToast("Đã phân tích xong.");
    // In real app show a nice modal, here alert is simpler
    alert(explanation.replace(/<br>/g, '\n').replace(/<b>/g,'').replace(/<\/b>/g,''));
}

function fixCurrentQuery() {
    let sql = document.getElementById('sql-editor').value;
    let suggestion = "";
    if(!sql) return;
    
    if(!sql.toUpperCase().includes('FROM') && sql.toUpperCase().includes('SELECT')) suggestion = "Thiếu mệnh đề FROM để chỉ định bảng.";
    else if(sql.includes("==")) suggestion = "Trong SQL so sánh bằng dùng '=', không dùng '=='.";
    else if(sql.toUpperCase().includes('WHERE') && sql.includes(',')) suggestion = "Trong WHERE, dùng AND/OR để nối điều kiện, không dùng dấu phẩy.";
    
    if(suggestion) alert("Gợi ý sửa lỗi: " + suggestion);
    else alert("Cú pháp cơ bản có vẻ ổn. Nếu vẫn lỗi, hãy kiểm tra tên Bảng/Cột.");
}

// 5. VISUALIZER (ERD)
function toggleVisualizer() {
    const el = document.getElementById('erd-visualizer');
    el.classList.toggle('hidden');
    // Mock render for demo purposes
    const svg = document.getElementById('erd-svg');
    if(!document.getElementById('erd-visualizer').classList.contains('hidden')) {
        setTimeout(drawERD, 100); // Wait for display block
    }
}

function drawERD() {
    const canvas = document.getElementById('erd-canvas');
    canvas.innerHTML = '<svg id="erd-svg" width="100%" height="100%"></svg>';
    const svg = document.getElementById('erd-svg');
    
    // 1. Parse Schema
    const tablesData = {};
    const tableList = alasql(`SHOW TABLES FROM ${alasql.useid}`);
    
    tableList.forEach(t => {
        const cols = alasql(`SHOW COLUMNS FROM ${t.tableid}`);
        let pk = cols.find(c => c.columnid.toLowerCase().startsWith('ma') || c.columnid.toLowerCase().includes('id'))?.columnid;
        if (!pk && cols.length > 0) pk = cols[0].columnid; 

        tablesData[t.tableid] = {
            name: t.tableid,
            columns: cols,
            pk: pk
        };
    });

    // Relationships
    const relationships = [];
    Object.values(tablesData).forEach(table => {
        table.columns.forEach(col => {
            const targetTable = Object.values(tablesData).find(t => t.name !== table.name && t.pk === col.columnid);
            if (targetTable) {
                col.isFK = true;
                relationships.push({ from: table.name, to: targetTable.name });
            }
            if (col.columnid === table.pk) {
                col.isPK = true;
            }
        });
    });

    // Render Tables
    const tableNames = Object.keys(tablesData);
    const count = tableNames.length;
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) - 140; 
    
    tableNames.forEach((name, i) => {
        const table = tablesData[name];
        const angle = (i / count) * 2 * Math.PI;
        const x = centerX + radius * Math.cos(angle) - 90;
        const y = centerY + radius * Math.sin(angle) - 100;

        const el = document.createElement('div');
        el.className = 'erd-table absolute bg-white border border-slate-300 rounded shadow-md text-sm w-48 transition-transform hover:z-50 hover:scale-105';
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.id = `erd-tbl-${name}`;

        let rowsHtml = '';
        table.columns.forEach(c => {
            let badge = '';
            let rowClass = '';
            if (c.isPK) {
                badge = '<span class="text-[10px] font-bold bg-yellow-100 text-yellow-700 px-1 rounded ml-auto">PK</span>';
                rowClass = 'bg-yellow-50/50 font-semibold';
            } else if (c.isFK) {
                badge = '<span class="text-[10px] font-bold bg-blue-100 text-blue-700 px-1 rounded ml-auto">FK</span>';
                rowClass = 'text-blue-900';
            }

            rowsHtml += `
                <div class="px-3 py-1.5 border-b border-slate-100 flex items-center ${rowClass}">
                    <div class="flex items-center gap-1 w-full">
                        ${c.isPK ? '<span class="material-symbols-outlined text-[12px] text-yellow-600">vpn_key</span>' : 
                          c.isFK ? '<span class="material-symbols-outlined text-[12px] text-blue-500">link</span>' : 
                          '<span class="material-symbols-outlined text-[12px] text-slate-300">abc</span>'}
                        <span class="truncate">${c.columnid}</span>
                        ${badge}
                    </div>
                </div>`;
        });

        el.innerHTML = `
            <div class="bg-gradient-to-r from-indigo-600 to-indigo-500 px-3 py-2 font-bold text-white text-center rounded-t border-b border-indigo-700 shadow-sm">
                ${table.name}
            </div>
            <div class="bg-white rounded-b">
                ${rowsHtml}
            </div>
        `;
        canvas.appendChild(el);
    });

    // Draw Lines
    setTimeout(() => { 
        relationships.forEach(rel => {
            const fromEl = document.getElementById(`erd-tbl-${rel.from}`);
            const toEl = document.getElementById(`erd-tbl-${rel.to}`);
            
            if(fromEl && toEl) {
                const x1 = parseFloat(fromEl.style.left) + fromEl.offsetWidth / 2;
                const y1 = parseFloat(fromEl.style.top) + fromEl.offsetHeight / 2;
                const x2 = parseFloat(toEl.style.left) + toEl.offsetWidth / 2;
                const y2 = parseFloat(toEl.style.top) + toEl.offsetHeight / 2;

                const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                line.setAttribute('x1', x1);
                line.setAttribute('y1', y1);
                line.setAttribute('x2', x2);
                line.setAttribute('y2', y2);
                line.setAttribute('stroke', '#94a3b8');
                line.setAttribute('stroke-width', '2');
                line.setAttribute('marker-end', 'url(#arrowhead)');
                svg.appendChild(line);
            }
        });
    }, 100);

    svg.innerHTML += `
        <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="#94a3b8" />
            </marker>
        </defs>
    `;
}

// 6. EXPORT / SHARE
function exportData(type) {
    const sql = document.getElementById('sql-editor').value;
    try {
        const res = alasql(sql);
        if(!res || res.length === 0) { alert("Không có dữ liệu để xuất."); return; }
        
        let content = "";
        if(type === 'json') {
            content = JSON.stringify(res, null, 2);
        } else {
            const header = Object.keys(res[0]).join(",");
            const rows = res.map(r => Object.values(r).join(",")).join("\n");
            content = header + "\n" + rows;
        }
        
        const blob = new Blob([content], {type: 'text/plain'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `export.${type}`;
        a.click();
    } catch(e) { alert("Lỗi khi xuất: " + e.message); }
}

function shareQuery() {
    const sql = document.getElementById('sql-editor').value;
    const url = new URL(window.location);
    url.searchParams.set('q', encodeURIComponent(sql));
    navigator.clipboard.writeText(url.toString());
    showToast("Đã copy link chia sẻ (kèm query)!");
}

// --- 8. AI MODULE (Stub + Cache) ---

// Generate SQL from Vietnamese text using AI
async function generateSQL() {
    const input = document.getElementById('ai-sql-input').value.trim();
    const output = document.getElementById('ai-sql-output');
    
    if (!input) {
        output.innerHTML = '<span class="text-red-500">Vui lòng nhập yêu cầu...</span>';
        return;
    }
    
    output.innerHTML = '<span class="loading-dots">Đang tạo SQL</span>';
    output.classList.remove('text-slate-400', 'italic');
    output.classList.add('text-slate-800');
    
    // Get current schema for context
    let schemaInfo = '';
    try {
        const currentDb = alasql.useid;
        const tables = alasql(`SHOW TABLES FROM ${currentDb}`);
        schemaInfo = `Database: ${currentDb}\n`;
        for (const t of tables) {
            const cols = alasql(`SHOW COLUMNS FROM ${t.tableid}`);
            schemaInfo += `Table ${t.tableid}: ${cols.map(c => c.columnid).join(', ')}\n`;
        }
    } catch (e) {
        schemaInfo = 'Schema: SinhVien(MaSV, HoTen, NgaySinh, GioiTinh, MaLop, DiemTB), Lop(MaLop, TenLop)';
    }
    
    const prompt = `Bạn là chuyên gia SQL. Hãy viết câu lệnh SQL dựa trên yêu cầu sau:

Context Schema:
${schemaInfo}

Yêu cầu: "${input}"

Chỉ trả về câu lệnh SQL, không cần giải thích. Nếu có thể, dùng cú pháp SQL Server.`;
    
    const res = await callGemini(prompt);
    
    if (res) {
        // Clean up result (remove markdown code blocks if any)
        let cleanSql = res.replace(/```sql/gi, '').replace(/```/g, '').trim();
        output.innerHTML = `<pre class="whitespace-pre-wrap text-left">${cleanSql}</pre>`;
    } else {
        output.innerHTML = '<span class="text-red-500">Vui lòng nhập API Key trong Cài đặt.</span>';
    }
}

// Explain code block using AI
async function explainCode(codeId, explainId, customPrompt) {
    const codeEl = document.getElementById(codeId);
    const explEl = document.getElementById(explainId);
    if (!codeEl || !explEl) return;
    
    const code = codeEl.innerText;
    explEl.style.display = 'block';
    explEl.innerHTML = '<span class="loading-dots">Đang phân tích</span>';
    
    const prompt = `${customPrompt}\n\nCode SQL:\n${code}\n\nHãy giải thích bằng tiếng Việt, ngắn gọn, dễ hiểu.`;
    const res = await callGemini(prompt);
    
    if (res) {
        explEl.innerHTML = marked.parse(res);
    } else {
        explEl.innerHTML = '<span class="text-red-500">Vui lòng nhập API Key trong Cài đặt.</span>';
    }
}

async function callGemini(prompt) {
    const key = localStorage.getItem('gemini_api_key');
    if(!key) { 
        openSettings(); 
        return null; 
    }
    
    // Cache check
    const cacheKey = 'ai_cache_' + btoa(unescape(encodeURIComponent(prompt))).slice(0, 50);
    const cached = localStorage.getItem(cacheKey);
    if(cached) return cached;

    // Get model from settings or use default
    const modelSetting = localStorage.getItem('sql_master_aiModel') || 'gemini_flash';
    const modelMap = {
        'gemini_flash': 'gemini-2.0-flash',
        'gemini_pro': 'gemini-1.5-pro',
        'gemini_lite': 'gemini-1.5-flash'
    };
    const model = modelMap[modelSetting] || 'gemini-2.0-flash';

    try {
        // Add timeout to prevent hanging forever
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
        
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Check for HTTP errors
        if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || `HTTP ${res.status}`;
            console.error('Gemini API Error:', errorMsg);
            return `Lỗi API: ${errorMsg}`;
        }
        
        const data = await res.json();
        
        // Check for API-level errors
        if (data.error) {
            console.error('Gemini Error:', data.error);
            return `Lỗi: ${data.error.message || 'Unknown error'}`;
        }
        
        const txt = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if(txt) {
            localStorage.setItem(cacheKey, txt);
            return txt;
        }
        
        // Handle blocked content or empty response
        if (data.candidates?.[0]?.finishReason === 'SAFETY') {
            return "Nội dung bị chặn bởi bộ lọc an toàn của AI.";
        }
        
        return "AI không trả về kết quả. Vui lòng thử lại.";
        
    } catch(e) { 
        if (e.name === 'AbortError') {
            return "Hết thời gian chờ (30s). Vui lòng thử lại.";
        }
        console.error('Gemini fetch error:', e);
        return `Lỗi kết nối: ${e.message}`; 
    }
}

async function askAIExplain(topic) {
    const btn = event.target;
    const originalText = btn.innerText;
    btn.innerText = "Đang hỏi AI...";
    const ans = await callGemini(`Giải thích ngắn gọn khái niệm SQL: ${topic} và cho ví dụ minh họa.`);
    if(ans) alert(ans); // Simple alert for now, could be a modal
    btn.innerText = originalText;
}

// AI EXERCISE GENERATION
function openAIExerciseModal() {
    document.getElementById('ai-exercise-modal').classList.remove('hidden');
}

async function submitAIExerciseGeneration() {
    const level = document.getElementById('ai-ex-level').value;
    const topic = document.getElementById('ai-ex-topic').value;
    document.getElementById('ai-exercise-modal').classList.add('hidden');

    showToast(`Đang tạo bài tập ${level}...`);
    
    // Construct prompt
    const prompt = `Tạo 1 bài tập SQL mới. 
    Level: ${level}. 
    Chủ đề: ${topic || 'Ngẫu nhiên'}. 
    Output JSON format: { "title": "...", "desc": "...", "dataset": "school" (hoặc ecommerce, hr), "solution": "..." }.
    Chỉ trả về JSON.`;

    const ans = await callGemini(prompt);
    if(ans) {
        try {
            const jsonStr = ans.substring(ans.indexOf('{'), ans.lastIndexOf('}')+1);
            const newEx = JSON.parse(jsonStr);
            
            // Add ID and Check function dynamically (simplified check)
            newEx.id = 'ai_' + Date.now();
            newEx.level = level; // Ensure level matches
            newEx.check = (r) => r.length > 0; // Generic check for AI exercises

            // Add to list
            EXERCISES.push(newEx);
            initExercises(); // Re-render
            alert(`Đã tạo bài tập mới: ${newEx.title}`);
        } catch(e) { alert("AI trả về định dạng sai."); console.error(e); }
    }
}

async function generateDemoSQL() {
    const outContainer = document.getElementById('demo-ai-result-container');
    const out = document.getElementById('demo-ai-output');
    const req = document.getElementById('demo-ai-input').value;
    
    if(!req.trim()) return;

    outContainer.classList.remove('hidden');
    out.innerHTML = '<span class="loading-dots">Đang viết code</span>';
    
    // Get current schema
    const currentDb = alasql.useid;
    const tables = alasql(`SHOW TABLES FROM ${currentDb}`);
    let schemaInfo = `Database: ${currentDb}\n`;
    
    for(const t of tables) {
        const cols = alasql(`SHOW COLUMNS FROM ${t.tableid}`);
        schemaInfo += `Table ${t.tableid}: ${cols.map(c=>c.columnid).join(', ')}\n`;
    }

    const prompt = `
Context Schema:
${schemaInfo}

User Request: "${req}"

Task: Write a valid SQL query compatible with AlaSQL (standard SQL) to answer the request based on the schema above. 
Return ONLY the SQL code block. No explanation.
`;

    const res = await callGemini(prompt, "You are a SQL generator. Output only raw SQL code without markdown backticks if possible, or inside a sql block.");
    
    // Clean up result (remove markdown code blocks if any)
    let cleanSql = res.replace(/```sql/g, '').replace(/```/g, '').trim();
    out.innerText = cleanSql;
}

function runGeneratedSQL() {
    const sql = document.getElementById('demo-ai-output').innerText;
    if(!sql) return;
    insertSampleQuery(sql); // Re-use existing function to put in editor and run
}

// --- 9. HELPERS (Visualizer, Export, etc.) ---
// Note: toggleVisualizer is defined in section 5 (line ~492)

function insertSampleQuery(sql) {
    document.getElementById('sql-editor').value = sql;
    runDemoQuery();
    scrollToSection('demo');
}

function runDemoQuery() {
    const sql = document.getElementById('sql-editor').value;
    const resDiv = document.getElementById('query-result-container');
    const countSpan = document.getElementById('row-count');
    try {
        const res = alasql(sql);
        // Handle multiple statements
        const data = (Array.isArray(res) && Array.isArray(res[0])) ? res[res.length-1] : res;
        
        if(!Array.isArray(data)) {
            resDiv.innerHTML = '<div class="p-4 text-green-600 font-mono text-sm">Thực thi thành công!</div>';
            countSpan.innerText = '-';
            return;
        }
        if(data.length === 0) {
            resDiv.innerHTML = '<div class="p-4 text-slate-400 italic text-sm">Không có dữ liệu trả về.</div>';
            countSpan.innerText = '0 dòng';
            return;
        }
        // Render
        let html = '<table class="sql-result-table"><thead><tr>';
        Object.keys(data[0]).forEach(k => html += `<th>${k}</th>`);
        html += '</tr></thead><tbody>';
        data.forEach(row => {
            html += '<tr>';
            Object.values(row).forEach(v => html += `<td>${v}</td>`);
            html += '</tr>';
        });
        html += '</tbody></table>';
        resDiv.innerHTML = html;
        countSpan.innerText = `${data.length} dòng`;
    } catch(e) {
        resDiv.innerHTML = `<div class="p-4 text-red-500 font-mono text-xs">Lỗi: ${e.message}</div>`;
    }
}

function switchSubTab(parentId, targetId) {
    // Hide all contents for this parent
    document.querySelectorAll(`#${parentId} .${parentId}-content`).forEach(el => el.classList.add('hidden'));
    // Show the target content
    document.getElementById(`${parentId}-${targetId}`).classList.remove('hidden');
    
    // Update button styles
    document.querySelectorAll(`.tab-btn-${parentId}`).forEach(btn => {
        // Remove active styling
        btn.classList.remove('active'); 
        // Add active styling if it matches the target
        if(btn.getAttribute('onclick').includes(`'${targetId}'`)) {
            btn.classList.add('active');
        }
    });
}

function scrollToSection(id) {
    document.querySelectorAll('.content-section').forEach(el => el.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    
    // Remove active highlight from all nav items first
    document.querySelectorAll('#sidebar .nav-item').forEach(btn => {
         btn.classList.remove('bg-indigo-50', 'text-indigo-700', 'border-r-4', 'border-indigo-600', 'font-bold');
         btn.classList.add('text-slate-600');
    });

    // Add highlight to clicked item (tricky part: find the button that called this)
    // We iterate and check onclick attribute
    document.querySelectorAll('#sidebar .nav-item').forEach(btn => {
        if(btn.getAttribute('onclick').includes(`'${id}'`)) {
            btn.classList.add('bg-indigo-50', 'text-indigo-700', 'border-r-4', 'border-indigo-600', 'font-bold');
            btn.classList.remove('text-slate-600');
        }
    });
}

// --- SETTINGS MANAGEMENT SYSTEM ---

function openSettings() { 
    document.getElementById('settings-modal').classList.remove('hidden');
    loadSettingsToUI();
}

function closeSettings() {
    document.getElementById('settings-modal').classList.add('hidden');
}

function loadSettings() {
    // Load each setting from localStorage
    const keys = Object.keys(SETTINGS_DEFAULT);
    keys.forEach(key => {
        const stored = localStorage.getItem(`sql_master_${key}`);
        if (stored !== null) {
            // Parse boolean and number values
            if (stored === 'true') APP_SETTINGS[key] = true;
            else if (stored === 'false') APP_SETTINGS[key] = false;
            else if (!isNaN(stored) && stored !== '') APP_SETTINGS[key] = parseInt(stored);
            else APP_SETTINGS[key] = stored;
        }
    });
    applyAllSettings();
}

function loadSettingsToUI() {
    // Theme
    const themeEl = document.getElementById('setting-theme');
    if (themeEl) themeEl.value = APP_SETTINGS.theme;
    
    // Effects
    const effectsEl = document.getElementById('setting-effects');
    if (effectsEl) effectsEl.checked = APP_SETTINGS.effectsEnabled;
    
    // Editor Font Size
    const fontSizeEl = document.getElementById('setting-editor-font-size');
    if (fontSizeEl) fontSizeEl.value = APP_SETTINGS.editorFontSize;
    
    // Editor Font Family
    const fontFamilyEl = document.getElementById('setting-editor-font-family');
    if (fontFamilyEl) fontFamilyEl.value = APP_SETTINGS.editorFontFamily;
    
    // Ligatures
    const ligaturesEl = document.getElementById('setting-editor-ligatures');
    if (ligaturesEl) ligaturesEl.checked = APP_SETTINGS.editorLigatures;
    
    // Auto Format Mode
    const autoFormatRadios = document.querySelectorAll('input[name="autoformat"]');
    autoFormatRadios.forEach(r => r.checked = (r.value === APP_SETTINGS.autoFormatMode));
    
    // API Key
    const apiKeyEl = document.getElementById('api-key-input');
    if (apiKeyEl) apiKeyEl.value = localStorage.getItem('gemini_api_key') || '';
    
    // AI Model
    const aiModelEl = document.getElementById('setting-ai-model');
    if (aiModelEl) aiModelEl.value = APP_SETTINGS.aiModel;
    
    // Result View
    const resultViewRadios = document.querySelectorAll('input[name="resultview"]');
    resultViewRadios.forEach(r => r.checked = (r.value === APP_SETTINGS.resultView));
    
    // ERD Mode
    const erdModeEl = document.getElementById('setting-erd-mode');
    if (erdModeEl) erdModeEl.value = APP_SETTINGS.erdMode;
    
    // Low Power
    const lowPowerEl = document.getElementById('setting-low-power');
    if (lowPowerEl) lowPowerEl.checked = APP_SETTINGS.lowPowerMode;
    
    // Language
    const languageEl = document.getElementById('setting-language');
    if (languageEl) languageEl.value = APP_SETTINGS.language;
    
    // High Contrast
    const highContrastEl = document.getElementById('setting-high-contrast');
    if (highContrastEl) highContrastEl.checked = APP_SETTINGS.highContrast;
    
    // UI Scale
    const uiScaleEl = document.getElementById('setting-ui-scale');
    if (uiScaleEl) uiScaleEl.checked = APP_SETTINGS.uiScale === 'large';
    
    // Autosave
    const autosaveEl = document.getElementById('setting-autosave');
    if (autosaveEl) autosaveEl.checked = APP_SETTINGS.autosaveEnabled;
}

function updateSetting(key, value) {
    APP_SETTINGS[key] = value;
    localStorage.setItem(`sql_master_${key}`, value);
    applySetting(key, value);
}

function applySetting(key, value) {
    const body = document.body;
    
    switch(key) {
        case 'theme':
            body.classList.remove('theme-light', 'theme-dark', 'theme-system');
            body.classList.add(`theme-${value}`);
            applyTheme(value);
            break;
            
        case 'effectsEnabled':
            body.classList.toggle('effects-off', !value);
            break;
            
        case 'editorFontSize':
            applyEditorStyles();
            break;
            
        case 'editorFontFamily':
            applyEditorStyles();
            break;
            
        case 'editorLigatures':
            applyEditorStyles();
            break;
            
        case 'lowPowerMode':
            body.classList.toggle('low-power', value);
            break;
            
        case 'highContrast':
            body.classList.toggle('high-contrast', value);
            break;
            
        case 'uiScale':
            body.classList.toggle('ui-large', value === 'large');
            break;
            
        case 'autosaveEnabled':
            if (value) setupAutosave();
            break;
    }
}

function applyAllSettings() {
    Object.keys(APP_SETTINGS).forEach(key => {
        applySetting(key, APP_SETTINGS[key]);
    });
}

function applyTheme(theme) {
    const body = document.body;
    let actualTheme = theme;
    
    if (theme === 'system') {
        actualTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    body.setAttribute('data-theme', actualTheme);
}

function applyEditorStyles() {
    const editors = [
        document.getElementById('sql-editor'),
        document.getElementById('ex-editor')
    ];
    
    const fontFamily = APP_SETTINGS.editorFontFamily === 'monospace' 
        ? 'monospace' 
        : `'${APP_SETTINGS.editorFontFamily}', monospace`;
    
    const ligatures = APP_SETTINGS.editorLigatures ? 'normal' : 'none';
    
    editors.forEach(editor => {
        if (editor) {
            editor.style.fontSize = `${APP_SETTINGS.editorFontSize}px`;
            editor.style.fontFamily = fontFamily;
            editor.style.fontVariantLigatures = ligatures;
        }
    });
}

function setupAutosave() {
    const sqlEditor = document.getElementById('sql-editor');
    const exEditor = document.getElementById('ex-editor');
    
    if (sqlEditor && !sqlEditor._autosaveAttached) {
        sqlEditor.addEventListener('input', () => {
            if (APP_SETTINGS.autosaveEnabled) {
                localStorage.setItem('sql_master_last_query', sqlEditor.value);
            }
        });
        sqlEditor._autosaveAttached = true;
        
        // Restore saved content
        const saved = localStorage.getItem('sql_master_last_query');
        if (saved && !sqlEditor.value) sqlEditor.value = saved;
    }
    
    if (exEditor && !exEditor._autosaveAttached) {
        exEditor.addEventListener('input', () => {
            if (APP_SETTINGS.autosaveEnabled) {
                localStorage.setItem('sql_master_last_exercise_query', exEditor.value);
            }
        });
        exEditor._autosaveAttached = true;
    }
}

function restoreAutosavedContent() {
    if (!APP_SETTINGS.autosaveEnabled) return;
    
    const sqlEditor = document.getElementById('sql-editor');
    const exEditor = document.getElementById('ex-editor');
    
    const savedQuery = localStorage.getItem('sql_master_last_query');
    const savedExQuery = localStorage.getItem('sql_master_last_exercise_query');
    
    if (sqlEditor && savedQuery && !sqlEditor.value) {
        sqlEditor.value = savedQuery;
    }
    if (exEditor && savedExQuery && !exEditor.value) {
        exEditor.value = savedExQuery;
    }
}

function saveAllSettings() {
    // Save API Key
    const apiKey = document.getElementById('api-key-input').value;
    if (apiKey) {
        localStorage.setItem('gemini_api_key', apiKey);
    }
    
    showToast('Đã lưu cài đặt!');
    closeSettings();
}

function saveApiKey() { 
    localStorage.setItem('gemini_api_key', document.getElementById('api-key-input').value); 
    showToast('Đã lưu API Key!');
}

async function testAIConnection() {
    const key = localStorage.getItem('gemini_api_key');
    if (!key) {
        showToast('Vui lòng nhập API Key trước!');
        return;
    }
    
    showToast('Đang kiểm tra kết nối...');
    
    // Get model from settings
    const modelSetting = localStorage.getItem('sql_master_aiModel') || 'gemini_flash';
    const modelMap = {
        'gemini_flash': 'gemini-2.0-flash',
        'gemini_pro': 'gemini-1.5-pro',
        'gemini_lite': 'gemini-1.5-flash'
    };
    const model = modelMap[modelSetting] || 'gemini-2.0-flash';
    
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ contents: [{ parts: [{ text: 'Xin chào' }] }] })
        });
        
        if (res.ok) {
            const data = await res.json();
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                showToast(`✓ Kết nối AI thành công! (${model})`);
            } else if (data.error) {
                showToast(`✗ Lỗi API: ${data.error.message}`);
            } else {
                showToast('✓ Kết nối OK nhưng không có phản hồi');
            }
        } else {
            const errorData = await res.json().catch(() => ({}));
            const errorMsg = errorData.error?.message || `HTTP ${res.status}`;
            showToast(`✗ Lỗi: ${errorMsg}`);
        }
    } catch(e) {
        showToast('✗ Lỗi kết nối: ' + e.message);
    }
}

function resetSettings() {
    if (!confirm('Khôi phục tất cả cài đặt về mặc định?\n(Không ảnh hưởng đến tài khoản và tiến độ học)')) return;
    
    // Get all localStorage keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        // Only remove settings, not user data
        if (key && key.startsWith('sql_master_') && 
            !key.includes('users') && 
            !key.includes('current_user') && 
            !key.includes('user')) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Reset to defaults
    APP_SETTINGS = { ...SETTINGS_DEFAULT };
    applyAllSettings();
    loadSettingsToUI();
    
    showToast('Đã khôi phục cài đặt mặc định!');
}

function clearAllData() {
    if (!confirm('XÓA TOÀN BỘ DỮ LIỆU?\n\nBao gồm:\n- Tài khoản đăng nhập\n- Tiến độ học tập (XP, Level)\n- Tất cả cài đặt\n\nHành động này KHÔNG THỂ hoàn tác!')) return;
    if (!confirm('XÁC NHẬN LẦN CUỐI: Bạn chắc chắn muốn xóa TẤT CẢ?')) return;
    
    // Remove all sql_master keys
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('sql_master')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Also remove API key
    localStorage.removeItem('gemini_api_key');
    
    showToast('Đã xóa toàn bộ dữ liệu. Đang tải lại...');
    setTimeout(() => location.reload(), 1500);
}
function showToast(msg) { 
    const t = document.getElementById('toast'); 
    document.getElementById('toast-msg').innerText = msg; 
    t.classList.remove('translate-y-[-150%]'); 
    setTimeout(() => t.classList.add('translate-y-[-150%]'), 2000); 
}

// --- Logic: Closure ---
function calculateClosure() {
    const attrs = document.getElementById('closure-input').value.split(',').map(s=>s.trim()).filter(s=>s);
    const fds = document.getElementById('fds-input').value.split('\n').map(l=>{
        const p=l.split('->'); return p.length===2?{lhs:p[0].split(','), rhs:p[1].split(',')}:null;
    }).filter(x=>x);
    let closure = new Set(attrs);
    let changed=true;
    let steps = [];
    while(changed){
        changed=false;
        fds.forEach(fd=>{
            if(fd.lhs.every(a=>closure.has(a.trim()))){
                fd.rhs.forEach(b=>{ 
                    if(!closure.has(b.trim())){ 
                        closure.add(b.trim()); 
                        steps.push(`Dùng ${fd.lhs}->${fd.rhs}: Thêm ${b.trim()}`);
                        changed=true; 
                    } 
                });
            }
        });
    }
    const resHtml = steps.length ? steps.map(s=>`<div>- ${s}</div>`).join('') : '<div>Không tìm thấy thuộc tính mới.</div>';
    document.getElementById('closure-result').innerHTML = resHtml + `<div class='mt-2 pt-2 border-t font-bold text-indigo-700'>Kết quả: { ${Array.from(closure).join(', ')} }</div>`;
}

// --- AI: Normalization ---
async function checkNormalForm() {
    const out = document.getElementById('nf-result');
    out.classList.remove('hidden'); out.innerHTML = '<span class="loading-dots">Đang kiểm tra</span>';
    const req = document.getElementById('nf-input').value;
    const res = await callGemini(`Kiểm tra dạng chuẩn cao nhất (1NF, 2NF, 3NF hay BCNF) cho lược đồ này: "${req}". Giải thích tại sao nó đạt/không đạt từng chuẩn.`, "DBA Expert");
    if (res) {
        out.innerHTML = marked.parse(res);
    } else {
        out.innerHTML = '<span class="text-red-500">Vui lòng nhập API Key trong Cài đặt.</span>';
    }
}

// --- AI: Decomposition ---
async function suggestDecomp() {
    const out = document.getElementById('decomp-result');
    out.classList.remove('hidden'); out.innerHTML = '<span class="loading-dots">Đang phân tích</span>';
    const req = document.getElementById('decomp-input').value;
    const res = await callGemini(`Gợi ý phân rã lược đồ này về 3NF/BCNF sao cho bảo toàn thông tin: "${req}".`, "DBA Expert");
    if (res) {
        out.innerHTML = marked.parse(res);
    } else {
        out.innerHTML = '<span class="text-red-500">Vui lòng nhập API Key trong Cài đặt.</span>';
    }
}

// Init
document.addEventListener('DOMContentLoaded', initApp);

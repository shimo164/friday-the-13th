// 13日の金曜日データを生成・管理するクラス
class Friday13thCalculator {
    constructor() {
        this.data = this.generateData(2001, 2100);
    }

    // 指定した年の範囲で13日の金曜日データを生成
    generateData(startYear, endYear) {
        const data = {};
        
        for (let year = startYear; year <= endYear; year++) {
            data[year] = {};
            let count = 0;
            
            for (let month = 1; month <= 12; month++) {
                const date = new Date(year, month - 1, 13);
                const isFriday = date.getDay() === 5; // 5 = 金曜日
                
                data[year][month] = isFriday;
                if (isFriday) count++;
            }
            
            data[year].count = count;
        }
        
        return data;
    }

    // 次の13日の金曜日を取得
    getNextFriday13th() {
        const today = new Date();
        const currentYear = today.getFullYear();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        // 今年の残りの月をチェック
        for (let month = currentMonth; month <= 12; month++) {
            if (this.data[currentYear] && this.data[currentYear][month]) {
                // 今月の場合は13日が過ぎていないかチェック
                if (month === currentMonth && currentDay >= 13) {
                    continue;
                }
                return new Date(currentYear, month - 1, 13);
            }
        }

        // 来年以降をチェック
        for (let year = currentYear + 1; year <= 2100; year++) {
            for (let month = 1; month <= 12; month++) {
                if (this.data[year] && this.data[year][month]) {
                    return new Date(year, month - 1, 13);
                }
            }
        }

        return null;
    }

    // 日付までの日数を計算
    getDaysUntil(targetDate) {
        const today = new Date();
        const diffTime = targetDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
}

// アプリケーションのメインクラス
class Friday13thApp {
    constructor() {
        this.calculator = new Friday13thCalculator();
        this.initializeElements();
        this.setupEventListeners();
        this.showHomePage();
    }

    initializeElements() {
        this.homeBtn = document.getElementById('homeBtn');
        this.statsBtn = document.getElementById('statsBtn');
        this.homePage = document.getElementById('homePage');
        this.statsPage = document.getElementById('statsPage');
        this.nextFridayElement = document.getElementById('nextFriday');
        this.countdownElement = document.getElementById('countdown');
        this.chartGrid = document.getElementById('chartGrid');
    }

    setupEventListeners() {
        this.homeBtn.addEventListener('click', () => this.showHomePage());
        this.statsBtn.addEventListener('click', () => this.showStatsPage());
    }

    showHomePage() {
        this.homePage.classList.add('active');
        this.statsPage.classList.remove('active');
        this.homeBtn.classList.add('active');
        this.statsBtn.classList.remove('active');
        
        this.updateNextFriday();
        this.startCountdown();
    }

    showStatsPage() {
        this.homePage.classList.remove('active');
        this.statsPage.classList.add('active');
        this.homeBtn.classList.remove('active');
        this.statsBtn.classList.add('active');
        
        this.generateChart();
    }

    updateNextFriday() {
        const nextFriday = this.calculator.getNextFriday13th();
        
        if (nextFriday) {
            const options = { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                weekday: 'long'
            };
            this.nextFridayElement.textContent = nextFriday.toLocaleDateString('ja-JP', options);
        } else {
            this.nextFridayElement.textContent = '計算範囲外です';
        }
    }

    startCountdown() {
        const updateCountdown = () => {
            const nextFriday = this.calculator.getNextFriday13th();
            
            if (nextFriday) {
                const days = this.calculator.getDaysUntil(nextFriday);
                
                if (days > 0) {
                    this.countdownElement.textContent = `あと ${days} 日`;
                } else if (days === 0) {
                    this.countdownElement.textContent = '今日です！';
                } else {
                    this.countdownElement.textContent = '';
                }
            }
        };

        updateCountdown();
        // 1時間ごとに更新
        setInterval(updateCountdown, 3600000);
    }

    generateChart() {
        if (this.chartGrid.children.length > 0) {
            return; // 既に生成済み
        }

        const data = this.calculator.data;
        
        // 2001年から2100年まで（100年分）
        for (let year = 2001; year <= 2100; year++) {
            // 年ラベル
            const yearLabel = document.createElement('div');
            yearLabel.className = 'year-label';
            
            const yearText = document.createElement('span');
            yearText.textContent = year;
            yearLabel.appendChild(yearText);
            
            // 年内の13日の金曜日の回数を表示
            if (data[year].count > 0) {
                const countSpan = document.createElement('span');
                countSpan.className = 'year-count';
                countSpan.textContent = `(${data[year].count})`;
                yearLabel.appendChild(countSpan);
            }
            
            this.chartGrid.appendChild(yearLabel);

            // 各月のセル
            for (let month = 1; month <= 12; month++) {
                const cell = document.createElement('div');
                cell.className = 'cell';
                
                const isFriday = data[year][month];
                cell.classList.add(isFriday ? 'friday' : 'normal');
                
                // ツールチップ用のデータ
                const date = new Date(year, month - 1, 13);
                const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                const dayName = dayNames[date.getDay()];
                
                cell.setAttribute('data-tooltip', 
                    `${year}年${month}月13日 (${dayName})`);
                
                this.chartGrid.appendChild(cell);
            }
        }
    }
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    new Friday13thApp();
});

// デバッグ用：コンソールで統計情報を表示
function showStats() {
    const calculator = new Friday13thCalculator();
    const data = calculator.data;
    
    let totalFridays = 0;
    const yearCounts = {};
    
    for (let year = 2001; year <= 2100; year++) {
        const count = data[year].count;
        totalFridays += count;
        
        if (!yearCounts[count]) {
            yearCounts[count] = 0;
        }
        yearCounts[count]++;
    }
    
    console.log('=== 13日の金曜日統計 (2001-2100) ===');
    console.log(`総発生回数: ${totalFridays}回`);
    console.log(`平均: ${(totalFridays / 100).toFixed(2)}回/年`);
    console.log('年間発生回数の分布:');
    
    Object.keys(yearCounts).sort().forEach(count => {
        console.log(`  ${count}回: ${yearCounts[count]}年`);
    });
}

class FloatingSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
    }

    render() {
        const currentPage = this.getAttribute('current-page') || '';
        
        this.shadowRoot.innerHTML = `
            <style>
                .floating-sidebar {
                    position: fixed;
                    left: 20px;
                    top: 50%;
                    transform: translateY(-50%);
                    z-index: 1000;
                    background: rgba(17, 24, 39, 0.25);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    padding: 16px 8px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                    transition: all 0.3s ease;
                }

                .floating-sidebar:hover {
                    box-shadow: 0 12px 40px rgba(255, 107, 26, 0.2);
                    border-color: rgba(255, 159, 67, 0.3);
                }

                .sidebar-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .nav-item {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                    color: #9CA3AF;
                    text-decoration: none;
                    transition: all 0.3s ease;
                    font-size: 20px;
                    position: relative;
                    cursor: pointer;
                }

                .nav-item:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: #ffffff;
                    transform: scale(1.1);
                }

                .nav-item.active {
                    background: linear-gradient(135deg, #ff6b1a, #ff4500);
                    color: white;
                    box-shadow: 0 4px 16px rgba(255, 107, 26, 0.4);
                }

                .nav-item.active:hover {
                    transform: scale(1.05);
                    box-shadow: 0 6px 20px rgba(255, 107, 26, 0.6);
                }

                .tooltip {
                    position: absolute;
                    left: 60px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: rgba(17, 24, 39, 0.95);
                    color: white;
                    padding: 8px 12px;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    white-space: nowrap;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    z-index: 1001;
                }

                .nav-item:hover .tooltip {
                    opacity: 1;
                    visibility: visible;
                    left: 65px;
                }

                /* Better icons using Unicode symbols */
                .icon-crm::before { content: "👥"; }
                .icon-insights::before { content: "📈"; }
            </style>

            <div class="floating-sidebar">
                <nav class="sidebar-nav">
                    <a href="crm.html" class="nav-item ${currentPage === 'crm' ? 'active' : ''}" data-page="crm">
                        <span class="icon-crm"></span>
                        <div class="tooltip">CRM</div>
                    </a>
                    <a href="insights.html" class="nav-item ${currentPage === 'insights' ? 'active' : ''}" data-page="insights">
                        <span class="icon-insights"></span>
                        <div class="tooltip">Insights</div>
                    </a>
                </nav>
            </div>
        `;
    }

    addEventListeners() {
        const navItems = this.shadowRoot.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const href = item.getAttribute('href');
                if (href) {
                    window.location.href = href;
                }
            });
        });
    }
}

customElements.define('floating-sidebar', FloatingSidebar);
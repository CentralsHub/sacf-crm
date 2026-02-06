class CustomNavigation extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        
        // Get current page to set active tab
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        this.shadowRoot.innerHTML = `
            <style>
                .nav-container {
                    background: #111827;
                    border-bottom: 1px solid #374151;
                    padding: 0;
                }
                .nav-tabs {
                    display: flex;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                .nav-tab {
                    flex: 1;
                    padding: 1rem 2rem;
                    text-align: center;
                    color: #9CA3AF;
                    text-decoration: none;
                    border-bottom: 3px solid transparent;
                    transition: all 0.3s ease;
                    font-weight: 500;
                    position: relative;
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    font-size: 1rem;
                }
                .nav-tab:hover {
                    color: #F3F4F6;
                    background: rgba(31, 41, 55, 0.5);
                }
                .nav-tab.active {
                    color: #60A5FA;
                    border-bottom-color: #60A5FA;
                    background: rgba(96, 165, 250, 0.1);
                }
                .nav-tab .tab-icon {
                    display: inline-block;
                    margin-right: 0.5rem;
                    font-size: 1.1rem;
                }
                @media (max-width: 768px) {
                    .nav-tab {
                        padding: 0.75rem 1rem;
                        font-size: 0.875rem;
                    }
                    .nav-tab .tab-text {
                        display: none;
                    }
                    .nav-tab .tab-icon {
                        margin-right: 0;
                        font-size: 1.25rem;
                    }
                }
            </style>
            <nav class="nav-container">
                <div class="nav-tabs">
                    <a href="index.html" class="nav-tab ${currentPage === 'index.html' || currentPage === '' ? 'active' : ''}">
                        <span class="tab-icon">📊</span>
                        <span class="tab-text">Dashboard</span>
                    </a>
                    <a href="crm.html" class="nav-tab ${currentPage === 'crm.html' ? 'active' : ''}">
                        <span class="tab-icon">👥</span>
                        <span class="tab-text">CRM</span>
                    </a>
                    <a href="insights.html" class="nav-tab ${currentPage === 'insights.html' ? 'active' : ''}">
                        <span class="tab-icon">📈</span>
                        <span class="tab-text">Insights</span>
                    </a>
                </div>
            </nav>
        `;
    }
}

customElements.define('custom-navigation', CustomNavigation);
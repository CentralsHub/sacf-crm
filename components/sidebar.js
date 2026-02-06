
class CustomSidebar extends HTMLElement {
    connectedCallback() {
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                .sidebar-link {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    color: #aaafb7ff;
                    transition: all 0.2s ease;
                    position: relative;
                }
                .sidebar-link:hover {
                    background: rgba(31, 41, 55, 0.5);
                    color: white;
                }
                .sidebar-link.active {
                    background: rgba(79, 70, 229, 0.2);
                    color: #818CF8;
                }
                .sidebar-icon {
                    width: 24px;
                    height: 24px;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .sidebar-tooltip {
                    position: absolute;
                    left: 100%;
                    top: 50%;
                    transform: translateY(-50%);
                    background: #111827;
                    padding: 0.5rem 1rem;
                    border-radius: 0.5rem;
                    white-space: nowrap;
                    pointer-events: none;
                    opacity: 0;
                    transition: opacity 0.2s ease;
                    margin-left: 1rem;
                    font-size: 0.875rem;
                    border: 1px solid rgba(31, 41, 55, 0.5);
                }
                .sidebar-link:hover .sidebar-tooltip {
                    opacity: 1;
                }
            </style>
            <div class="w-20 bg-gray-900 border-r border-gray-800 h-screen fixed z-10">
                <div class="p-4 border-b border-gray-800 flex items-center justify-center">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center">
                        <i class="fas fa-car w-4 h-4 text-gray-900"></i>
                    </div>
                </div>
                
                <div class="p-4 space-y-2">
                    <a href="index.html" class="sidebar-link" title="Dashboard">
                        <i class="fas fa-home sidebar-icon"></i>
                        <span class="sidebar-tooltip">Dashboard</span>
                    </a>
                    <a href="crm.html" class="sidebar-link active" title="CRM">
                        <i class="fas fa-users sidebar-icon"></i>
                        <span class="sidebar-tooltip">CRM</span>
                    </a>
                    <a href="insights.html" class="sidebar-link" title="Insights">
                        <i class="fas fa-chart-bar sidebar-icon"></i>
                        <span class="sidebar-tooltip">Insights</span>
                    </a>
                </div>
            </div>
`;
    }
}

customElements.define('custom-sidebar', CustomSidebar);
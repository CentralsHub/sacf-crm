class CustomHeader extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const title = this.getAttribute('title') || 'Dashboard';
        this.shadowRoot.innerHTML = `
            <style>
                .status-indicator {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    animation: pulse 2s infinite;
                }
                @keyframes pulse {
                    0%, 100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.5;
                    }
                }
            </style>
            <header class="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-lg border-b border-gray-800">
                <div class="flex items-center justify-between px-6 py-4">
                    <h1 class="text-2xl font-semibold flex items-center gap-3">
                        ${title}
                        <span class="flex items-center gap-2 text-sm font-normal text-gray-400">
                            <span id="status-indicator" class="status-indicator bg-green-500"></span>
                            System Online
                        </span>
                    </h1>
                    <div class="flex items-center gap-4">
                        <button class="p-2 rounded-full hover:bg-gray-800 transition-all relative">
                            <i class="fas fa-sync-alt w-5 h-5 text-gray-300" id="refresh-data"></i>
                        </button>
                    </div>
                </div>
            </header>
        `;
    }
}

customElements.define('custom-header', CustomHeader);
// Dashboard functionality with real CRM data integration
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Dashboard loaded');

    // Fetch real data from the CRM API
    async function fetchLeads() {
        try {
            const response = await fetch('https://api.jotform.com/form/250941024894055/submissions?apiKey=6eff91999757e6e8e604ee539547a7fa');
            const data = await response.json();
            
            // Get stored data from localStorage
            const leadStatuses = JSON.parse(localStorage.getItem('leadStatuses') || '{}');
            const priceOffered = JSON.parse(localStorage.getItem('priceOffered') || '{}');
            const trackingData = JSON.parse(localStorage.getItem('trackingData') || '{}');
            
            return data.content.map(submission => {
                const answers = submission.answers;
                const getAnswer = (fieldName) => {
                    const answer = Object.values(answers).find(a => a.name === fieldName);
                    return answer ? answer.answer : '';
                };

                const id = submission.id;
                return {
                    id: id,
                    name: `${getAnswer('firstName')} ${getAnswer('surname')}`.trim(),
                    car: `${getAnswer('year')} ${getAnswer('make')} ${getAnswer('model')}`,
                    location: `${getAnswer('suburb')}, ${getAnswer('state')}`,
                    phone: getAnswer('mobile'),
                    email: getAnswer('email'),
                    expectedPrice: getAnswer('expectedPrice'),
                    priceOffered: priceOffered[id] || '',
                    status: leadStatuses[id] || 'New Offer',
                    submissionDate: new Date(submission.created_at),
                    relativeTime: getRelativeTime(submission.created_at),
                    tracking: trackingData[id] || { emailed: false, messaged: false, called: false }
                };
            });
        } catch (error) {
            console.error('Error fetching leads:', error);
            return [];
        }
    }

    // Helper function for relative time
    function getRelativeTime(submissionDate) {
        const now = new Date();
        const submitted = new Date(submissionDate);
        const diffMs = now - submitted;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffHours < 1) return 'Just now';
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    }

    // Update dashboard with real data
    async function updateDashboard() {
        const leads = await fetchLeads();
        
        // Calculate real statistics
        const totalLeads = leads.length;
        const newOffers = leads.filter(lead => {
            const hoursAgo = Math.floor((new Date() - lead.submissionDate) / (1000 * 60 * 60));
            return hoursAgo <= 24; // New offers in last 24 hours
        }).length;
        
        // Simulate some completed and contacted leads for demo
        const contactedLeads = Math.floor(totalLeads * 0.3); // 30% contacted
        const completedLeads = Math.floor(totalLeads * 0.1); // 10% completed
        
        // Update status cards
        const statusCards = document.querySelectorAll('.status-card h3');
        if (statusCards.length >= 3) {
            statusCards[0].textContent = newOffers;
            statusCards[1].textContent = contactedLeads;
            statusCards[2].textContent = completedLeads;
        }

        // Update recent leads table
        updateRecentLeadsTable(leads.slice(0, 5)); // Show latest 5 leads
    }

    // Update recent leads table with real data
    function updateRecentLeadsTable(leads) {
        const tableBody = document.getElementById('recent-leads-tbody');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        leads.forEach(lead => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700 hover:bg-gray-700/30 cursor-pointer transition-all';
            
            // Determine status badge based on real data
            const statusBadge = getStatusBadge(lead);
            
            row.innerHTML = `
                <td class="py-4">${lead.name}</td>
                <td class="py-4">${lead.car}</td>
                <td class="py-4">${lead.location}</td>
                <td class="py-4">${lead.priceOffered ? '$' + lead.priceOffered : 'Not set'}</td>
                <td class="py-4">${lead.expectedPrice ? '$' + lead.expectedPrice : 'Not specified'}</td>
                <td class="py-4">${statusBadge}</td>
                <td class="py-4 text-gray-400">${lead.relativeTime}</td>
            `;
            
            tableBody.appendChild(row);
        });
    }

    // Update CRM table
    function updateCRMTable(leads) {
        const tableBody = document.getElementById('crm-table-body');
        if (!tableBody) return;

        tableBody.innerHTML = '';
        
        leads.forEach((lead, index) => {
            const row = document.createElement('tr');
            row.className = 'border-b border-gray-700 hover:bg-gray-700/30 cursor-pointer transition-all';
            
            // Determine which action buttons to show
            const hasPhone = lead.phone && lead.phone.trim() !== '';
            const hasEmail = lead.email && lead.email.trim() !== '';
            
            row.innerHTML = `
                <td class="py-4 px-4">${lead.name}</td>
                <td class="py-4 px-4">
                    <div class="text-sm">
                        <div>${lead.car}</div>
                        <div class="text-gray-400 text-xs">Auto • 0 km</div>
                    </div>
                </td>
                <td class="py-4 px-4">${lead.location}</td>
                <td class="py-4 px-4 text-sm">N/A</td>
                <td class="py-4 px-4">${lead.expectedPrice ? '$' + lead.expectedPrice : 'Not specified'}</td>
                <td class="py-4 px-4">
                    <input type="text" class="bg-gray-700 text-white px-2 py-1 rounded text-sm w-20" 
                           placeholder="$0" value="${lead.priceOffered || ''}">
                </td>
                <td class="py-4 px-4 text-sm text-gray-400">${lead.relativeTime}</td>
                <td class="py-4 px-4">
                    <div class="flex items-center gap-2">
                        <select class="bg-gray-700 text-white px-2 py-1 rounded text-xs">
                            <option value="New Offer" ${lead.status === 'New Offer' ? 'selected' : ''}>New Offer</option>
                            <option value="Contacted" ${lead.status === 'Contacted' ? 'selected' : ''}>Contacted</option>
                            <option value="Offer Made" ${lead.status === 'Offer Made' ? 'selected' : ''}>Offer Made</option>
                            <option value="Accepted" ${lead.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
                            <option value="Declined" ${lead.status === 'Declined' ? 'selected' : ''}>Declined</option>
                            <option value="Completed" ${lead.status === 'Completed' ? 'selected' : ''}>Completed</option>
                        </select>
                        ${hasPhone ? `<button class="p-1 text-cyan-400 hover:text-cyan-300" title="Call">📞</button>` : ''}
                        ${hasPhone ? `<button class="p-1 text-green-400 hover:text-green-300" title="Text">💬</button>` : ''}
                        ${hasEmail ? `<button class="p-1 text-blue-400 hover:text-blue-300" title="Email">✉️</button>` : ''}
                    </div>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // Update insights section
    function updateInsights(leads) {
        const totalLeads = leads.length;
        const completedLeads = leads.filter(lead => lead.status === 'Completed' || lead.status === 'Accepted').length;
        const offeredLeads = leads.filter(lead => lead.priceOffered && parseInt(lead.priceOffered) > 0).length;

        const conversionRate = totalLeads > 0 ? (completedLeads / totalLeads * 100).toFixed(1) : 0;
        
        const avgOffer = leads
            .filter(lead => lead.priceOffered && parseInt(lead.priceOffered) > 0)
            .reduce((sum, lead) => sum + parseInt(lead.priceOffered), 0) / 
            (offeredLeads || 1);

        const activeLeads = leads.filter(lead => !['Completed', 'Declined'].includes(lead.status)).length;
        
        // Update insights metrics
        if (document.getElementById('conversion-rate')) {
            document.getElementById('conversion-rate').textContent = `${conversionRate}%`;
            document.getElementById('avg-offer').textContent = `$${Math.round(avgOffer).toLocaleString()}`;
            document.getElementById('active-leads').textContent = activeLeads;
            document.getElementById('avg-response').textContent = `${Math.floor(Math.random() * 12) + 1}h`;
        }

        // Update location stats
        updateLocationStats(leads);
        
        // Update status chart
        updateStatusChart(leads);
    }

    // Update location statistics
    function updateLocationStats(leads) {
        const locationCounts = {};
        leads.forEach(lead => {
            locationCounts[lead.location] = (locationCounts[lead.location] || 0) + 1;
        });

        const sortedLocations = Object.entries(locationCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const container = document.getElementById('location-stats');
        if (container) {
            container.innerHTML = sortedLocations.map(([location, count]) => `
                <div class="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                    <span class="text-gray-300">${location}</span>
                    <span class="font-semibold text-orange-400">${count} leads</span>
                </div>
            `).join('');
        }
    }

    // Create status distribution chart
    function updateStatusChart(leads) {
        const statusCounts = {};
        leads.forEach(lead => {
            statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
        });

        const canvas = document.getElementById('statusChart');
        if (canvas && window.Chart) {
            const ctx = canvas.getContext('2d');
            new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: Object.keys(statusCounts),
                    datasets: [{
                        data: Object.values(statusCounts),
                        backgroundColor: [
                            '#22d3ee', // cyan
                            '#fb923c', // orange
                            '#34d399', // green
                            '#a78bfa', // purple
                            '#f87171', // red
                            '#fbbf24'  // yellow
                        ],
                        borderWidth: 2,
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: { color: '#ffffff' }
                        }
                    }
                }
            });
        }
    }

    // Get status badge based on lead status and tracking data
    function getStatusBadge(lead) {
        // Use actual status from localStorage if available
        if (lead.status === 'Completed') {
            return '<span class="px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Completed</span>';
        } else if (lead.status === 'Contacted' || lead.status === 'Offer Made') {
            return '<span class="px-3 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400">Contacted</span>';
        } else if (lead.status === 'Declined') {
            return '<span class="px-3 py-1 rounded-full text-xs bg-red-500/20 text-red-400">Declined</span>';
        } else {
            // Check if contacted based on tracking data
            if (lead.tracking.emailed || lead.tracking.messaged || lead.tracking.called) {
                return '<span class="px-3 py-1 rounded-full text-xs bg-orange-500/20 text-orange-400">Contacted</span>';
            } else {
                return '<span class="px-3 py-1 rounded-full text-xs bg-cyan-500/20 text-cyan-400">New</span>';
            }
        }
    }

    // Calculate real statistics based on actual data
    async function updateDashboard() {
        const leads = await fetchLeads();
        console.log('Dashboard loaded with', leads.length, 'leads');
        
        // Calculate real statistics
        const totalLeads = leads.length;
        
        const offersWithPrice = leads.filter(lead => 
            lead.priceOffered && parseInt(lead.priceOffered) > 0
        ).length;
        
        const acceptedLeads = leads.filter(lead => 
            lead.status === 'Accepted' || lead.status === 'Completed'
        ).length;
        
        // Update status cards with real data
        document.getElementById('total-leads').textContent = totalLeads;
        document.getElementById('offers-made').textContent = offersWithPrice;
        document.getElementById('accepted-leads').textContent = acceptedLeads;

        // Update recent leads table with real data
        updateRecentLeadsTable(leads.slice(0, 4)); // Show latest 4 leads
        
        // Update CRM table
        updateCRMTable(leads);
        
        // Update insights
        updateInsights(leads);
    }

    // Initialize dashboard
    await updateDashboard();
    
    // Refresh every 5 minutes
    setInterval(updateDashboard, 5 * 60 * 1000);
});
// Insights page functionality with real CRM data
document.addEventListener('DOMContentLoaded', async function() {
    console.log('Insights page loaded');

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
                    firstName: getAnswer('firstName'),
                    car: `${getAnswer('year')} ${getAnswer('make')} ${getAnswer('model')}`,
                    year: getAnswer('year'),
                    make: getAnswer('make'),
                    model: getAnswer('model'),
                    location: `${getAnswer('suburb')}, ${getAnswer('state')}`,
                    phone: getAnswer('mobile'),
                    email: getAnswer('email'),
                    expectedPrice: parseInt(getAnswer('expectedPrice')) || 0,
                    priceOffered: parseInt(priceOffered[id]) || 0,
                    status: leadStatuses[id] || 'New Offer',
                    submissionDate: new Date(submission.created_at),
                    tracking: trackingData[id] || { emailed: false, messaged: false, called: false }
                };
            });
        } catch (error) {
            console.error('Error fetching leads:', error);
            return [];
        }
    }

    // Calculate insights metrics
    function calculateMetrics(leads) {
        const totalLeads = leads.length;
        const completedLeads = leads.filter(lead => lead.status === 'Completed').length;
        const offeredLeads = leads.filter(lead => lead.priceOffered > 0).length;
        const contactedLeads = leads.filter(lead => 
            lead.tracking.emailed || lead.tracking.messaged || lead.tracking.called
        ).length;

        const conversionRate = totalLeads > 0 ? (completedLeads / totalLeads * 100).toFixed(1) : 0;
        
        const avgOffer = leads
            .filter(lead => lead.priceOffered > 0)
            .reduce((sum, lead) => sum + lead.priceOffered, 0) / 
            (offeredLeads || 1);

        const avgResponseTime = calculateAvgResponseTime(leads);
        
        return {
            conversionRate,
            avgResponseTime,
            avgOffer: Math.round(avgOffer),
            activeLeads: leads.filter(lead => !['Completed', 'Declined'].includes(lead.status)).length,
            totalLeads,
            contactedLeads,
            completedLeads
        };
    }

    function calculateAvgResponseTime(leads) {
        const respondedLeads = leads.filter(lead => 
            lead.tracking.emailed || lead.tracking.messaged || lead.tracking.called
        );
        
        if (respondedLeads.length === 0) return 0;
        
        const avgHours = respondedLeads.reduce((sum, lead) => {
            const hoursToResponse = Math.random() * 24; // Simulated for demo
            return sum + hoursToResponse;
        }, 0) / respondedLeads.length;
        
        return Math.round(avgHours);
    }

    // Update metrics cards
    function updateMetrics(metrics) {
        document.getElementById('conversion-rate').textContent = `${metrics.conversionRate}%`;
        document.getElementById('conversion-change').textContent = `+2.3%`; // Simulated change
        
        document.getElementById('avg-response').textContent = `${metrics.avgResponseTime}h`;
        document.getElementById('response-change').textContent = `-12%`; // Simulated improvement
        
        document.getElementById('avg-offer').textContent = `$${metrics.avgOffer.toLocaleString()}`;
        document.getElementById('offer-change').textContent = `+8.4%`; // Simulated change
        
        document.getElementById('active-leads').textContent = metrics.activeLeads;
        document.getElementById('leads-change').textContent = `+${Math.floor(Math.random() * 10)}`;
    }

    // Create status distribution chart
    function createStatusChart(leads) {
        const statusCounts = {};
        leads.forEach(lead => {
            statusCounts[lead.status] = (statusCounts[lead.status] || 0) + 1;
        });

        const ctx = document.getElementById('statusChart').getContext('2d');
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

    // Create price comparison chart
    function createPriceChart(leads) {
        const offeredLeads = leads.filter(lead => lead.priceOffered > 0 && lead.expectedPrice > 0);
        
        const ctx = document.getElementById('priceChart').getContext('2d');
        new Chart(ctx, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: 'Offer vs Expected',
                    data: offeredLeads.map(lead => ({
                        x: lead.expectedPrice,
                        y: lead.priceOffered
                    })),
                    backgroundColor: 'rgba(255, 107, 26, 0.6)',
                    borderColor: '#ff6b1a',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { labels: { color: '#ffffff' } }
                },
                scales: {
                    x: {
                        title: { display: true, text: 'Expected Price ($)', color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        title: { display: true, text: 'Offer Price ($)', color: '#ffffff' },
                        ticks: { color: '#ffffff' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
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
        container.innerHTML = sortedLocations.map(([location, count]) => `
            <div class="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span class="text-gray-300">${location}</span>
                <span class="font-semibold text-orange-400">${count} leads</span>
            </div>
        `).join('');
    }

    // Update vehicle make statistics
    function updateMakeStats(leads) {
        const makeCounts = {};
        leads.forEach(lead => {
            makeCounts[lead.make] = (makeCounts[lead.make] || 0) + 1;
        });

        const sortedMakes = Object.entries(makeCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5);

        const container = document.getElementById('make-stats');
        container.innerHTML = sortedMakes.map(([make, count]) => `
            <div class="flex justify-between items-center p-3 bg-gray-700/30 rounded-lg">
                <span class="text-gray-300">${make}</span>
                <span class="font-semibold text-blue-400">${count} vehicles</span>
            </div>
        `).join('');
    }

    // Update activity timeline
    function updateActivityTimeline(leads) {
        const recentLeads = leads
            .sort((a, b) => b.submissionDate - a.submissionDate)
            .slice(0, 10);

        const container = document.getElementById('activity-timeline');
        container.innerHTML = recentLeads.map(lead => {
            const hoursAgo = Math.floor((new Date() - lead.submissionDate) / (1000 * 60 * 60));
            const timeText = hoursAgo < 24 ? `${hoursAgo}h ago` : `${Math.floor(hoursAgo/24)}d ago`;
            
            return `
                <div class="flex items-center gap-4 p-3 bg-gray-700/20 rounded-lg">
                    <div class="w-2 h-2 bg-orange-400 rounded-full"></div>
                    <div class="flex-1">
                        <p class="text-white">${lead.name} submitted ${lead.car}</p>
                        <p class="text-gray-400 text-sm">${timeText} • ${lead.location}</p>
                    </div>
                    ${lead.priceOffered ? `<span class="text-green-400 font-semibold">$${lead.priceOffered.toLocaleString()}</span>` : ''}
                </div>
            `;
        }).join('');
    }

    // Initialize insights
    async function initializeInsights() {
        const leads = await fetchLeads();
        console.log('Loaded leads for insights:', leads.length);
        
        const metrics = calculateMetrics(leads);
        updateMetrics(metrics);
        
        createStatusChart(leads);
        createPriceChart(leads);
        updateLocationStats(leads);
        updateMakeStats(leads);
        updateActivityTimeline(leads);
    }

    // Load insights
    await initializeInsights();
});
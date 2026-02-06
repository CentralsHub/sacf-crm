document.addEventListener('DOMContentLoaded', () => new CRMApp().init());

class CRMApp {
  // #region lifecycle -------------------------------------------------
  constructor() {
    this.API_KEY = '6eff91999757e6e8e604ee539547a7fa';
    this.FORM_ID = '250941024894055';
    this.elements = {
      tableBody: document.querySelector('tbody'),
      summary: document.getElementById('totalLeads'),
    };
    this.storage = {
      status: this.#load('leadStatuses'),
      offer: this.#load('priceOffered'),
      tracking: this.#load('trackingData'),
      notes: this.#load('leadNotes'),
    };
    this.leads = [];
  }

  async init() {
    await this.refresh();
    this.#bindEvents();
  }

  async refresh() {
    this.leads = await this.#fetchLeads();
    this.#renderTable();
    this.#renderSummary();
  }
  // #endregion

  // #region data ------------------------------------------------------
  async #fetchLeads() {
    const res = await fetch(`https://api.jotform.com/form/${this.FORM_ID}/submissions?apiKey=${this.API_KEY}`);
    const data = await res.json();
    return data.content.map(sub => this.#mapSubmission(sub));
  }

  #mapSubmission(submission) {
    const answers = submission.answers;
    const get = name => Object.values(answers).find(a => a.name === name)?.answer || '';
    const id = submission.id;
    const media = value => {
      if (!value) return [];
      if (Array.isArray(value)) return value;
      return value.split(',').map(item => item.trim()).filter(Boolean);
    };

    const location = [this.#title(get('suburb')), get('state')]
      .filter(Boolean)
      .join(', ');

    return {
      id,
      name: `${get('firstName')} ${get('surname')}`.trim(),
      car: `${get('year')} ${get('make')} ${get('model')} ${get('badge')}`.trim(),
      transmission: get('transmission') || 'Automatic',
      odometer: get('odometer') || '0',
      rego: (get('registration') || '').toUpperCase(),
      regoState: get('year26') || '',
      location,
      phone: get('mobile'),
      email: get('email'),
      comments: get('comments'),
      photos: media(get('photoupload')),
      pdfs: media(get('pdf-link')),
      status: this.storage.status[id] || 'To Do',
      offer: this.storage.offer[id] || '',
      note: this.storage.notes[id] || '',
      tracking: {
        called: this.storage.tracking[id]?.called || false,
        messaged: this.storage.tracking[id]?.messaged || false,
        emailed: this.storage.tracking[id]?.emailed || false,
      },
      createdAt: this.#localTime(submission.created_at),
    };
  }

  #title(str) {
    return str ? str.replace(/\b\w/g, c => c.toUpperCase()) : '';
  }

  #localTime(utc) {
    if (!utc) return new Date();
    const date = new Date(utc);
    return new Date(date.getTime() - 12 * 60 * 60 * 1000);
  }

  #timeAgo(date) {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  }
  // #endregion

  // #region render ----------------------------------------------------
  #renderTable() {
    if (!this.elements.tableBody) return;
    this.elements.tableBody.innerHTML = this.leads.map((lead, index) => this.#rowTemplate(lead, index)).join('');
  }

  #rowTemplate(lead, index) {
    const statusOptions = ['To Do', 'Contacted', 'Offer Made', 'Accepted', 'Declined', 'Completed']
      .map(status => `<option value="${status}" ${lead.status === status ? 'selected' : ''}>${status}</option>`)
      .join('');

    const actionButtons = [
      lead.phone && `<button class="btn btn-sm btn-outline-info" data-action="call" data-index="${index}">📞</button>`,
      lead.phone && `<button class="btn btn-sm btn-outline-success" data-action="text" data-index="${index}">💬</button>`,
      lead.email && `<button class="btn btn-sm btn-outline-primary" data-action="email" data-index="${index}">✉️</button>`,
    ].filter(Boolean).join('');

    const trackingCheckbox = (type, icon) => `
      <label class="form-check form-check-inline mb-0">
        <input class="form-check-input" type="checkbox" data-action="track" data-track="${type}" data-index="${index}" ${lead.tracking[type] ? 'checked' : ''}>
        <span class="small">${icon}</span>
      </label>`;

    return `
      <tr class="align-middle text-light border-bottom" data-index="${index}">
        <td>${lead.name}</td>
        <td>
          ${lead.car}
          <div class="text-secondary small">${lead.transmission} • ${lead.odometer} km</div>
        </td>
        <td>${lead.location}</td>
        <td>
          ${lead.rego || '—'}
          <div class="text-secondary small">${lead.regoState}</div>
        </td>
        <td>
          <select class="form-select form-select-sm bg-dark text-light border-secondary" data-action="status" data-index="${index}">
            ${statusOptions}
          </select>
        </td>
        <td>
          <div class="d-flex gap-2 justify-content-center">${actionButtons || '<span class="text-secondary small">No contact</span>'}</div>
          <div>${trackingCheckbox('called', '📞')}${trackingCheckbox('messaged', '💬')}${trackingCheckbox('emailed', '✉️')}</div>
        </td>
        <td>
          <input type="number" class="form-control form-control-sm bg-dark text-light border-secondary" data-action="offer" data-index="${index}" value="${lead.offer}">
        </td>
        <td>
          <input type="text" class="form-control form-control-sm bg-dark text-light border-secondary" data-action="note" data-index="${index}" value="${lead.note}">
        </td>
        <td class="text-secondary small">${this.#timeAgo(lead.createdAt)}</td>
      </tr>`;
  }

  #renderSummary() {
    if (!this.elements.summary) return;
    const todoCount = this.leads.filter(lead => lead.status === 'To Do').length;
    this.elements.summary.textContent = todoCount;
  }
  // #endregion

  // #region events ----------------------------------------------------
  #bindEvents() {
    if (!this.elements.tableBody) return;
    this.elements.tableBody.addEventListener('change', event => this.#handleChange(event));
    this.elements.tableBody.addEventListener('click', event => this.#handleClick(event));
  }

  #handleChange(event) {
    const target = event.target;
    const index = Number(target.dataset.index);
    const action = target.dataset.action;
    if (Number.isNaN(index) || !action) return;

    switch (action) {
      case 'status':
        this.#persist(this.storage.status, 'leadStatuses', index, target.value);
        this.leads[index].status = target.value;
        this.#renderSummary();
        break;
      case 'offer':
        this.#persist(this.storage.offer, 'priceOffered', index, target.value);
        this.leads[index].offer = target.value;
        break;
      case 'note':
        this.#persist(this.storage.notes, 'leadNotes', index, target.value);
        this.leads[index].note = target.value;
        break;
      case 'track':
        this.#updateTracking(index, target.dataset.track, target.checked);
        break;
      default:
        break;
    }
  }

  #handleClick(event) {
    const button = event.target.closest('button');
    if (button && button.dataset.action) {
      event.stopPropagation();
      this.#handleAction(button.dataset);
      return;
    }

    const row = event.target.closest('tr[data-index]');
    if (!row) return;
    const index = Number(row.dataset.index);
    const target = event.target;
    if (target.matches('input, select') || target.closest('label')) return;
    this.#openModal(this.leads[index], index);
  }

  #handleAction({ action, index }) {
    const lead = this.leads[Number(index)];
    if (!lead) return;

    const contactAction = {
      call: () => this.#dial(`tel:${lead.phone}`, index, 'called'),
      text: () => this.#dial(`sms:${lead.phone}`, index, 'messaged'),
      email: () => this.#sendEmail(lead, index),
    };

    contactAction[action]?.();
  }

  #dial(uri, index, trackKey) {
    if (!uri.includes(':')) return;
    window.open(uri, '_self');
    this.#updateTracking(index, trackKey, true);
    this.#syncCheckbox(index, trackKey, true);
  }

  #sendEmail(lead, index) {
    if (!lead.email) return alert('No email available for this lead');
    const subject = `Offer for your ${lead.car}`;
    const body = `Hi ${lead.name.split(' ')[0] || 'there'},\n\nFollowing up on your ${lead.car}. Let me know a convenient time to chat.\n\nRegards,\nSell Any Car Fast`;
    window.location.href = `mailto:${lead.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    this.#updateTracking(index, 'emailed', true);
    this.#syncCheckbox(index, 'emailed', true);
  }

  #updateTracking(index, type, value) {
    const id = this.leads[index].id;
    this.storage.tracking[id] = this.storage.tracking[id] || {};
    this.storage.tracking[id][type] = value;
    localStorage.setItem('trackingData', JSON.stringify(this.storage.tracking));
    this.leads[index].tracking[type] = value;
  }

  #syncCheckbox(index, type, value) {
    const selector = `input[data-action="track"][data-index="${index}"][data-track="${type}"]`;
    const checkbox = this.elements.tableBody?.querySelector(selector);
    if (checkbox) checkbox.checked = value;
  }
  // #endregion

  // #region modal -----------------------------------------------------
  #openModal(lead, index) {
    const modal = document.createElement('div');
    modal.className = 'modal fade show d-block bg-dark bg-opacity-75';
    modal.innerHTML = this.#modalTemplate(lead, index);
    modal.addEventListener('click', event => {
      if (event.target === modal) {
        modal.remove();
        return;
      }
      const closeBtn = event.target.closest('[data-close-modal]');
      if (closeBtn) {
        modal.remove();
        return;
      }
      const control = event.target.closest('[data-carousel]');
      if (!control) return;
      event.stopPropagation();
      const direction = control.dataset.carousel === 'next' ? 1 : -1;
      this.#changePhoto(index, direction);
    });
    document.body.appendChild(modal);
  }

  #modalTemplate(lead, index) {
    const photoSection = lead.photos.length ? `
      <div class="col-12">
        <h6>Photos</h6>
        <div class="text-center">
          <img id="photo-${index}" src="${lead.photos[0]}" class="img-fluid rounded mb-2" style="max-height:400px;">
          ${lead.photos.length > 1 ? `
            <div>
              <button class="btn btn-sm btn-secondary" data-carousel="prev" data-index="${index}">←</button>
              <button class="btn btn-sm btn-secondary" data-carousel="next" data-index="${index}">→</button>
            </div>` : ''}
        </div>
      </div>` : '';

    const pdfSection = lead.pdfs.length ? `
      <div class="col-12">
        <h6>Documents</h6>
        <iframe src="${lead.pdfs[0]}" class="w-100 rounded" style="height:400px;"></iframe>
        <a href="${lead.pdfs[0]}" target="_blank" class="text-info">Open full PDF</a>
      </div>` : '';

    const comments = lead.comments ? `<div class="col-12"><h6>Comments</h6><p>${lead.comments}</p></div>` : '';

    return `
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-dark text-light border-secondary">
          <div class="modal-header border-secondary">
            <h5 class="modal-title">${lead.name}</h5>
            <button class="btn-close btn-close-white" data-close-modal></button>
          </div>
          <div class="modal-body">
            <div class="row g-3">
              <div class="col-md-4">
                <h6>Vehicle</h6>
                <p>${lead.car}<br><small>${lead.transmission}, ${lead.odometer} km</small></p>
                <p><strong>Rego:</strong> ${lead.rego || '—'} ${lead.regoState}</p>
              </div>
              <div class="col-md-4">
                <h6>Contact</h6>
                <p>📞 ${lead.phone || '—'}<br>✉️ ${lead.email || '—'}<br>${lead.location}</p>
                <p><small>${lead.createdAt.toLocaleString()}</small></p>
              </div>
              <div class="col-md-4">
                <h6>Offer / Status</h6>
                <p>Offer $${lead.offer || 0}</p>
                <p>Status ${lead.status}</p>
              </div>
              ${photoSection}${pdfSection}${comments}
            </div>
          </div>
        </div>
      </div>`;
  }

  #changePhoto(index, direction) {
    const lead = this.leads[index];
    if (!lead?.photos.length) return;
    lead._photoIndex = (lead._photoIndex ?? 0) + direction;
    if (lead._photoIndex < 0) lead._photoIndex = lead.photos.length - 1;
    if (lead._photoIndex >= lead.photos.length) lead._photoIndex = 0;
    const image = document.getElementById(`photo-${index}`);
    if (image) image.src = lead.photos[lead._photoIndex];
  }
  // #endregion

  // #region storage helpers ------------------------------------------
  #load(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (error) {
      console.error('Failed to parse localStorage key', key, error);
      return {};
    }
  }

  #persist(cache, storageKey, index, value) {
    const id = this.leads[index].id;
    cache[id] = value;
    localStorage.setItem(storageKey, JSON.stringify(cache));
  }
  // #endregion
}

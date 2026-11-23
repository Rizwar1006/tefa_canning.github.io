/* Navigasi antar halaman (hash) */
const V=['home','organisasi','eduwisata','kemitraan','formulir-permintaan','kontak'];
function go(){
  const [h,queryString='']=(location.hash||'#home').slice(1).split('?');
  const v=h==='kalender-eduwisata'?'eduwisata':V.includes(h)?h:'home';
  V.forEach(x=>document.getElementById(x).hidden=x!==v);
  document.getElementById('hero').classList.toggle('in',!document.body.classList.contains('cv'));
  document.querySelectorAll('[data-v]').forEach(a=>a.classList.toggle('on',a.dataset.v===v));
  if(h==='kalender-eduwisata') document.getElementById('kalender-eduwisata').scrollIntoView();
  else if(h==='formulir-permintaan'){
    const query=new URLSearchParams(queryString);
    const topic=query.get('topik');
    topicSelect.value=['edu-wisata','kemitraan-produk','lainnya'].includes(topic)?topic:'';
    const date=query.get('tanggal');
    visitDate.value=date&&date>=toDateValue(today)?date:'';
    if(visitDate.value){
      const [year,month]=visitDate.value.split('-').map(Number);
      calendarMonth=new Date(year,month-1,1);
    }
    updateTopicFields();
    renderCalendar();
    document.getElementById('formulir-permintaan').scrollIntoView();
  }
  else scrollTo(0,0);
}
if(!location.hash)document.body.classList.add('cv');
addEventListener('hashchange',()=>{document.body.classList.remove('cv');go()});
const masukBtn = document.getElementById('masuk');
if(masukBtn) {
  masukBtn.onclick=e=>{e.preventDefault();document.body.classList.remove('cv');location.hash='#home';go()};
}

/* Kartu Produk & Mesin (slider) */
const D={
  Produk:[["Sarden SIP Saus Tomat","sarden-saus-tomat.jpeg","Sarden dengan saus tomat yang diolah higienis dan dikemas dalam kaleng oleh Teaching Factory."],
          ["Sarden SIP Larutan Garam","sarden-sip-larutan-garam.jpeg","Sarden dalam larutan garam, diproduksi UPT Pengolahan dan Pengemasan Politeknik Negeri Jember."],
          ["Sarden SIP Saus Cabai","sarden-saus-cabai.jpeg","Sarden lezat dengan paduan saus cabai pedas mantap yang menggugah selera."]],
  Mesin:[ ["Seamer","mesin-seamer.jpeg","Menutup kaleng secara rapat agar produk tahan lama dan aman."],
          ["Retort (Autoclave)","proses-sterilisasi.jpeg","Mensterilkan kaleng pada suhu dan tekanan tinggi sebelum dipasarkan."],
          ["Mesin Pencuci Ikan","pencuci-ikan.jpeg","Membersihkan ikan dari kotoran, lendir, dan darah menggunakan air mengalir dan sikat putar lembut."],
          ["Mesin Peniris Ikan","peniris-ikan.jpeg","Mengurangi kadar air berlebih setelah pencucian menggunakan sistem putaran atau rak berlubang."]]


};
Object.entries(D).forEach(([k,v])=>{
  let i=-1;const c=document.createElement('article');c.className='card pc';
  const cardsEl = document.getElementById('cards');
  if(cardsEl) cardsEl.append(c);
  const r=d=>{i=(i+d+v.length)%v.length;const[t,im,x]=v[i];
    c.innerHTML=`<div class="lb"><span>${k}</span><span>0${i+1}/0${v.length}</span></div><img src="img/${im}" alt="${t}"><div class="tr"><h3>${t}</h3><span><button data-d="-1">←</button><button data-d="1">→</button></span></div><p>${x}</p>`};
  c.onclick=e=>{if(e.target.dataset.d)r(+e.target.dataset.d)};r(1);
});

/* Jejaring mitra: filter tahun dan urutan nama */
const M=[
  ["Nama Mitra A (contoh)","Bidang kerja sama (data contoh)",2022],
  ["Nama Mitra B (contoh)","Bidang kerja sama (data contoh)",2023],
  ["Nama Mitra C (contoh)","Bidang kerja sama (data contoh)",2023],
  ["Nama Mitra D (contoh)","Bidang kerja sama (data contoh)",2024]
];
const mb=document.getElementById('mitra');
const sortMitra=document.getElementById('sort-mitra');
let mitraYear='Semua';
function showM(){
  if(!mb) return;
  const direction=sortMitra&&sortMitra.value==='desc'?-1:1;
  const partners=M.filter(m=>mitraYear==='Semua'||m[2]===Number(mitraYear))
    .sort((a,b)=>direction*a[0].localeCompare(b[0],'id'));
  mb.innerHTML=partners.length?partners.map(m=>`<article class="card"><div class="ph" style="height:90px"></div><h3 style="font-size:17px">${m[0]}</h3><p style="font-size:13px;color:var(--g)">${m[1]}<br>Tahun ${m[2]}</p></article>`).join(''):'<p class="empty-state">Belum ada data mitra untuk tahun ini.</p>';
}
document.querySelectorAll('.pl button[data-year]').forEach(button=>button.addEventListener('click',()=>{
  document.querySelectorAll('.pl button[data-year]').forEach(item=>item.classList.remove('on'));
  button.classList.add('on');
  mitraYear=button.dataset.year;
  showM();
}));
if(sortMitra) sortMitra.addEventListener('change',showM);
showM();

/* Kalender edu wisata dan formulir terpadu */
const calendarTitle=document.getElementById('calendar-title');
const calendarDays=document.getElementById('calendar-days');
const visitDate=document.getElementById('visit-date');
const topicSelect=document.getElementById('request-topic');
const eduFields=document.getElementById('edu-fields');
const partnershipFields=document.getElementById('partnership-fields');
const otherFields=document.getElementById('other-fields');
const form=document.getElementById('request-form');
const today=new Date();
today.setHours(0,0,0,0);
let calendarMonth=new Date(today.getFullYear(),today.getMonth(),1);

function toDateValue(date){
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}

function renderCalendar(){
  if(!calendarTitle||!calendarDays) return;
  calendarTitle.textContent=new Intl.DateTimeFormat('id-ID',{month:'long',year:'numeric'}).format(calendarMonth);
  calendarDays.replaceChildren();
  const firstDay=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),1).getDay();
  const daysInMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,0).getDate();
  for(let blank=0;blank<firstDay;blank++) calendarDays.append(document.createElement('span'));
  for(let day=1;day<=daysInMonth;day++){
    const date=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth(),day);
    const value=toDateValue(date);
    const button=document.createElement('button');
    button.type='button';
    button.className='calendar-day';
    button.textContent=day;
    button.setAttribute('aria-label',new Intl.DateTimeFormat('id-ID',{dateStyle:'full'}).format(date));
    button.disabled=date<today;
    if(value===visitDate.value) button.classList.add('selected');
    button.addEventListener('click',()=>{
      visitDate.value=value;
      renderCalendar();
    });
    calendarDays.append(button);
  }
  updateCalendarSummary();
}

function updateCalendarSummary(){
  const label=document.getElementById('selected-date-label');
  const status=document.getElementById('selected-date-status');
  const link=document.getElementById('edu-form-link');
  if(!label||!status||!link) return;
  if(visitDate.value){
    const [year,month,day]=visitDate.value.split('-').map(Number);
    const selected=new Date(year,month-1,day);
    label.textContent=new Intl.DateTimeFormat('id-ID',{dateStyle:'full'}).format(selected);
    status.textContent='Tanggal dipilih · menunggu pengajuan';
    link.href=`#formulir-permintaan?topik=edu-wisata&tanggal=${visitDate.value}`;
  }else{
    label.textContent='Pilih tanggal yang diinginkan';
    status.textContent='Tanggal pilihan akan ditampilkan di sini.';
    link.href='#formulir-permintaan?topik=edu-wisata';
  }
}

function updateTopicFields(){
  if(!topicSelect) return;
  const sections=[
    [eduFields,topicSelect.value==='edu-wisata'],
    [partnershipFields,topicSelect.value==='kemitraan-produk'],
    [otherFields,topicSelect.value==='lainnya']
  ];
  sections.forEach(([section,visible])=>{
    section.hidden=!visible;
    section.querySelectorAll('[data-topic-required]').forEach(field=>{field.required=visible});
  });
}

if(visitDate){
  visitDate.min=toDateValue(today);
  visitDate.addEventListener('change',()=>{
    if(!visitDate.value) return;
    const [year,month]=visitDate.value.split('-').map(Number);
    calendarMonth=new Date(year,month-1,1);
    renderCalendar();
  });
}
if(topicSelect) topicSelect.addEventListener('change',updateTopicFields);
const previousMonth=document.getElementById('calendar-prev');
const nextMonth=document.getElementById('calendar-next');
if(previousMonth) previousMonth.addEventListener('click',()=>{
  calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()-1,1);
  renderCalendar();
});
if(nextMonth) nextMonth.addEventListener('click',()=>{
  calendarMonth=new Date(calendarMonth.getFullYear(),calendarMonth.getMonth()+1,1);
  renderCalendar();
});
if(form) form.addEventListener('submit',event=>{
  event.preventDefault();
  const topic=topicSelect.options[topicSelect.selectedIndex].text;
  alert(`Terima kasih. Formulir ${topic} berhasil divalidasi (simulasi; belum terhubung ke layanan pengiriman).`);
  form.reset();
  updateTopicFields();
  renderCalendar();
});
updateTopicFields();
renderCalendar();
go();

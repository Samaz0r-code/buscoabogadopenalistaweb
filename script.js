// =================== IMAGE FALLBACKS ===================
// Fotos jurídicas verificadas de Unsplash como backup
const legalFallbacks = {
  'hero-img':    'https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?w=1400&q=85', // sala tribunal
  'about-img':   'https://images.unsplash.com/photo-1521791055366-0d553872952f?w=1000&q=85', // reunión legal
  'atty-photo':  [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=600&q=85',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=85',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=85',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&q=85',
  ]
};
let attyIdx = 0;
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    const cls = this.className;
    if (cls.includes('hero-img'))  this.src = legalFallbacks['hero-img'];
    else if (cls.includes('about-img')) this.src = legalFallbacks['about-img'];
    else if (cls.includes('atty-photo')) {
      this.src = legalFallbacks['atty-photo'][attyIdx % 4];
      attyIdx++;
    }
  });
});
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => { cursor.style.left=e.clientX+'px'; cursor.style.top=e.clientY+'px'; }, {passive:true});

// =================== NAV ===================
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 60);
});

// =================== FORM STATUS ===================
window.addEventListener('load', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const status = urlParams.get('status');
  if (status === 'success') {
    alert('¡Gracias por tu consulta! Un abogado especialista te contactará en 5 minutos.');
    // Limpiar la URL para evitar alertas repetitivas
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (status === 'error') {
    alert('Hubo un error al enviar tu consulta. Por favor, intentá nuevamente o usá el número de WhatsApp.');
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

// =================== REVEAL ===================
const revEls = document.querySelectorAll('.reveal');
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.1 });
revEls.forEach(el => revObs.observe(el));

// =================== TESTIMONIALS ===================
let curT = 0;
function switchTestimonial(idx) {
  document.querySelectorAll('.t-item').forEach((el,i) => el.classList.toggle('active', i===idx));
  document.querySelectorAll('.t-nav-item').forEach((el,i) => el.classList.toggle('active', i===idx));
  curT = idx;
}
setInterval(() => switchTestimonial((curT+1) % 3), 7000);

// =================== NEURAL CANVAS ===================
(function(){
  const canvas = document.getElementById('neuralCanvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, nodes=[], animId;
  const NODE_COUNT = window.innerWidth < 768 ? 20 : 55;
  const MAX_DIST = window.innerWidth < 768 ? 100 : 160;

  function resize(){
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  function initNodes(){
    nodes = [];
    for(let i=0;i<NODE_COUNT;i++){
      nodes.push({
        x: Math.random()*W, y: Math.random()*H,
        vx:(Math.random()-0.5)*0.35, vy:(Math.random()-0.5)*0.35,
        r: Math.random()*2+1,
        pulse:Math.random()*Math.PI*2
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    const t = Date.now()/1000;

    // Edges
    for(let i=0;i<nodes.length;i++){
      for(let j=i+1;j<nodes.length;j++){
        const dx=nodes[i].x-nodes[j].x, dy=nodes[i].y-nodes[j].y;
        const dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<MAX_DIST){
          const alpha=(1-dist/MAX_DIST)*0.35;
          ctx.beginPath();
          ctx.strokeStyle=`rgba(212,160,32,${alpha})`;
          ctx.lineWidth=0.5;
          ctx.moveTo(nodes[i].x,nodes[i].y);
          ctx.lineTo(nodes[j].x,nodes[j].y);
          ctx.stroke();
        }
      }
    }

    // Nodes
    nodes.forEach(n=>{
      n.pulse += 0.03;
      const p = Math.sin(n.pulse)*0.4+0.6;
      ctx.beginPath();
      ctx.arc(n.x,n.y,n.r*p,0,Math.PI*2);
      ctx.fillStyle=`rgba(212,160,32,${p*0.75})`;
      ctx.fill();

      // Moving
      n.x+=n.vx; n.y+=n.vy;
      if(n.x<0||n.x>W) n.vx*=-1;
      if(n.y<0||n.y>H) n.vy*=-1;
    });
    animId=requestAnimationFrame(draw);
  }

  resize(); initNodes(); draw();
  window.addEventListener('resize',()=>{ resize(); initNodes(); });
})();

// =================== COUNTER ANIMATION ===================
function animCounter(el, end, suffix='', duration=2200){
  let start=null;
  function step(ts){
    if(!start) start=ts;
    const p=Math.min((ts-start)/duration,1);
    const ease=1-Math.pow(1-p,4);
    el.textContent=Math.round(ease*end)+suffix;
    if(p<1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}

const counterObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      counterObs.unobserve(e.target);
      animCounter(document.getElementById('metricPrecedents'), 40247, '');
      setTimeout(()=>{ document.getElementById('metricSpeed').textContent='1.2ms'; },300);
      setTimeout(()=>animCounter(document.getElementById('metricAccuracy'),91,'%'),500);
    }
  });
},{threshold:0.3});
const aiSec=document.getElementById('ai-section');
if(aiSec) counterObs.observe(aiSec);

// =================== TYPEWRITER TERMINAL ===================
(function(){
  const el = document.getElementById('typeTarget');
  if(!el) return;
  const phrases = [
    'analizar_riesgo --empresa="Grupo Fonseca"',
    'buscar_precedente --tema="prescripcion penal economica"',
    'redactar_excepcion --tipo="incompetencia"',
    'monitorear_regulatorio --organismos="AFIP,CNV,UIF"',
  ];
  let pi=0, ci=0, deleting=false;
  function type(){
    const phrase=phrases[pi];
    if(!deleting){
      el.textContent=phrase.slice(0,ci+1);
      ci++;
      if(ci===phrase.length){ deleting=true; setTimeout(type,2200); return; }
    } else {
      el.textContent=phrase.slice(0,ci-1);
      ci--;
      if(ci===0){ deleting=false; pi=(pi+1)%phrases.length; }
    }
    setTimeout(type, deleting?40:80);
  }
  setTimeout(type,2000);
})();

// =================== FLOATING AI ASSISTANT ===================
function toggleAI(){
  const p=document.getElementById('aiPanel');
  p.classList.toggle('open');
}

const aiResponses = {
  default: [
    "Gracias por tu consulta. Basado en lo que describís, un socio senior puede evaluar tu caso hoy mismo. ¿Querés que coordinemos una llamada en la próxima hora?",
    "Eso entra dentro de nuestras áreas de mayor experiencia. Nuestro sistema ya identificó 3 precedentes relevantes. ¿Te enviamos un análisis preliminar?",
    "Entendido. En situaciones como esta, las primeras horas son críticas. Podemos tener a un abogado hablando con vos en menos de 90 minutos. ¿Cuándo es mejor?",
    "Tu situación tiene salida. Lo primero es frenar cualquier acción de la contraparte. ¿Puedo tomar tus datos para que un socio te llame ahora?"
  ],
  corporativo: "Derecho societario es nuestra especialidad central. Conflictos de socios, tomas hostiles, acuerdos de accionistas — actuamos en el día. ¿Querés hablar con un socio?",
  litigios: "Nuestro equipo de litigios tiene 97% de resultados favorables. Podemos iniciar medidas cautelares en horas si es necesario. ¿Me contás más del caso?",
  tributario: "AFIP, CNV, UIF — los conocemos bien. Los primeros 48 horas ante una inspección son clave. ¿Cuál es tu situación actual?",
  'consulta urgente': "Perfecto. Un abogado especialista te va a contactar en 5 minutos. Por favor dejame tu nombre, teléfono y una descripción breve del problema.",
};

function aiQuick(topic){
  const msgs=document.getElementById('aiMsgs');
  const key=topic.toLowerCase().replace(' ','');
  addMsg(topic, 'user');
  showTyping();
  setTimeout(()=>{
    removeTyping();
    const resp = aiResponses[key] || aiResponses.default[Math.floor(Math.random()*aiResponses.default.length)];
    addMsg(resp,'bot');
  },1400);
}

function aiSend(){
  const inp=document.getElementById('aiInput');
  const val=inp.value.trim();
  if(!val) return;
  addMsg(val,'user');
  inp.value='';
  showTyping();
  setTimeout(()=>{
    removeTyping();
    const resp=aiResponses.default[Math.floor(Math.random()*aiResponses.default.length)];
    addMsg(resp,'bot');
  },1600);
}

function addMsg(text,role){
  const msgs=document.getElementById('aiMsgs');
  const d=document.createElement('div');
  d.className='ai-msg '+role;
  d.textContent=text;
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(){
  const msgs=document.getElementById('aiMsgs');
  const d=document.createElement('div');
  d.className='ai-msg-typing'; d.id='aiTyping';
  d.innerHTML='<span></span><span></span><span></span>';
  msgs.appendChild(d);
  msgs.scrollTop=msgs.scrollHeight;
}

function removeTyping(){
  const t=document.getElementById('aiTyping');
  if(t) t.remove();
}

// =================== WHATSAPP FORM SUBMISSION ===================
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      const email = this.elements['email'].value.trim();
      const phone = this.elements['phone'].value.trim();
      const service = this.elements['service'].value;
      const message = this.elements['message'].value.trim();
      
      const whatsappNumber = '5491128011002'; // Número de WhatsApp del sitio
      
      const text = `Hola, quiero hacer una consulta profesional.

*Email:* ${email}
*Teléfono:* ${phone}
*Tipo de causa:* ${service}

*Mensaje:*
${message}`;

      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedText}`;
      
      // Abrir WhatsApp en una nueva pestaña
      window.open(whatsappUrl, '_blank');
      
      // Opcional: limpiar el formulario después de enviarlo
      this.reset();
    });
  }
});

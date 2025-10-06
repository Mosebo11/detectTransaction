
(function(){
  try {
    // Seed a default Super Admin if none exists
    var users = JSON.parse(localStorage.getItem('users') || '[]');
    if (!users.some(function(u){ return u && u.role==='admin'; })) {
      users.unshift({name:'Super Admin', email:'admin@example.com', password:'admin123', role:'admin'});
      localStorage.setItem('users', JSON.stringify(users));
    }
  } catch(e){ console.error('seed admin failed', e); }

  function getCurrentUser(){ try{ return JSON.parse(sessionStorage.getItem('currentUser')||'null'); }catch(e){ return null; } }

  function hideRegistration() {
    var regPage = document.getElementById('register-page') || document.getElementById('register-form');
    if (regPage) regPage.style.display = 'none';
    // hide register links/buttons
    document.querySelectorAll('a,button').forEach(function(el){
      try {
        if (el.textContent && /register/i.test(el.textContent)) el.style.display='none';
      } catch(e){}
    });
  }

  function patchLogin() {
    var form = document.getElementById('login-form');
    if (!form) return;
    form.addEventListener('submit', function(e){
      try{ e.stopImmediatePropagation(); } catch(err){}
      e.preventDefault();
      var emailEl = document.getElementById('login-email') || document.querySelector('input[type="email"]');
      var passEl = document.getElementById('login-password') || document.querySelector('input[type="password"]');
      var email = emailEl ? (emailEl.value||'').trim() : '';
      var password = passEl ? (passEl.value||'') : '';
      var users = JSON.parse(localStorage.getItem('users')||'[]');
      var user = users.find(function(u){ return u && u.email===email && u.password===password; });
      var msgEl = document.getElementById('login-msg') || document.getElementById('msg') || null;
      if(!user){
        if(msgEl) msgEl.innerText = 'Invalid credentials.';
        else alert('Invalid credentials.');
        return;
      }
      sessionStorage.setItem('currentUser', JSON.stringify({name:user.name,email:user.email,role:user.role}));
      window.location.href = 'dashboard.html';
    }, true);
  }

  function protectAddStaffPage(){
    if (location.href.indexOf('addstaff_form.html')!==-1){
      var cur = getCurrentUser();
      if(!cur || cur.role!=='admin'){
        alert('Only admin can access this page');
        location.href = 'dashboard.html';
      }
    }
  }

  function adjustStaffPage(){
    if (location.href.indexOf('staff.html')!==-1){
      var cur = getCurrentUser();
      document.querySelectorAll('a,button').forEach(function(el){
        try{
          if (/add staff/i.test(el.textContent || '')){
            if(!cur || cur.role!=='admin') el.style.display='none';
          }
        }catch(e){}
      });
    }
  }

  // Redirect direct visits to removed pages back to index
  if (/register\.html$/i.test(location.href) || /clients\.html$/i.test(location.href)){
    location.href = 'index.html';
  }

  document.addEventListener('DOMContentLoaded', function(){
    try{
      hideRegistration();
      patchLogin();
      protectAddStaffPage();
      adjustStaffPage();
    }catch(e){ console.error(e); }
  });
})();

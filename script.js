const products=[
{id:1,name:"Offlimit Core Hoodie",price:89,type:"Hoodies",img:"product-1.jpg"},
{id:2,name:"Signature Tee",price:45,type:"T-Shirts",img:"product-2.jpg"},
{id:3,name:"Pray Different Tee",price:45,type:"T-Shirts",img:"product-3.jpg"},
{id:4,name:"Utility Cargo Pants",price:75,type:"Pants",img:"product-4.jpg"},
{id:5,name:"Symbol Cap",price:35,type:"Accessories",img:"product-5.jpg"},
{id:6,name:"Essential Jacket",price:120,type:"Jackets",img:"product-6.jpg"}];

let cart=JSON.parse(localStorage.getItem("offlimitCart")||"[]");
const grid=document.querySelector("#productGrid"), count=document.querySelector("#cartCount");
const money=n=>`$${n.toFixed(2)}`;

function renderProducts(filter="All"){
  grid.innerHTML="";
  products
    .filter(p=>filter==="All"||p.type===filter)
    .forEach(p=>{
      const el=document.createElement("article");
      el.className="product";
      el.innerHTML=`
        <img class="product-img" src="${p.img}" alt="${p.name}">
        <div class="product-info">
          <h3>${p.name}</h3>
          <p>${money(p.price)}</p>
          <div class="dots">
            <i class="dot"></i>
            <i class="dot red"></i>
            <i class="dot"></i>
          </div>
        </div>`;
      el.onclick=()=>openProduct(p);
      grid.appendChild(el);
    })
}

function updateCount(){
  count.textContent=cart.reduce((a,i)=>a+i.qty,0);
  localStorage.setItem("offlimitCart",JSON.stringify(cart))
}

function renderCart(){
  const box=document.querySelector("#cartItems");
  const total=document.querySelector("#cartTotal");
  box.innerHTML="";
  let sum=0;

  if(!cart.length){
    box.innerHTML='<p style="color:#777;font-size:12px;padding:30px 0">Your cart is empty.</p>'
  }

  cart.forEach(i=>{
    sum+=i.price*i.qty;

    const p=document.createElement("div");
    p.className="cart-item";
    p.innerHTML=`
      <img src="${i.img}" alt="">
      <div>
        <h4>${i.name}</h4>
        <p>${money(i.price)} × ${i.qty}</p>
      </div>
      <button class="remove">×</button>`;

    p.querySelector(".remove").onclick=()=>{
      cart=cart.filter(x=>x.id!==i.id);
      updateCount();
      renderCart()
    };

    box.appendChild(p)
  });

  total.textContent=money(sum)
}

function openCart(){
  renderCart();
  document.querySelector("#cartDrawer").classList.add("open");
  document.querySelector("#backdrop").classList.add("open")
}

function closeCart(){
  document.querySelector("#cartDrawer").classList.remove("open");
  document.querySelector("#backdrop").classList.remove("open")
}

document.querySelectorAll('[data-action="cart"]').forEach(b=>b.onclick=openCart);
document.querySelector('[data-close="cartDrawer"]').onclick=closeCart;
document.querySelector("#backdrop").onclick=closeCart;

function openProduct(p){
  document.querySelector("#modalImg").src=p.img;
  document.querySelector("#modalName").textContent=p.name;
  document.querySelector("#modalPrice").textContent=money(p.price);
  document.querySelector("#productModal").classList.add("open");

  document.querySelectorAll(".sizes button").forEach(x=>x.classList.remove("selected"));
  document.querySelector(".sizes button:nth-child(2)").classList.add("selected");

  document.querySelector("#modalAdd").onclick=()=>{
    const found=cart.find(x=>x.id===p.id);

    if(found){
      found.qty++
    }else{
      cart.push({...p,qty:1})
    }

    updateCount();
    document.querySelector("#productModal").classList.remove("open");
    openCart()
  }
}

document.querySelector(".modal-close").onclick=()=>{
  document.querySelector("#productModal").classList.remove("open")
};

document.querySelectorAll(".sizes button").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".sizes button").forEach(x=>x.classList.remove("selected"));
  b.classList.add("selected")
});

document.querySelectorAll(".filter").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
  renderProducts(b.dataset.filter)
});

document.querySelectorAll(".collection-card").forEach(b=>b.onclick=()=>{
  const f=b.dataset.filter;
  document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===f));
  renderProducts(f)
});

document.querySelector("#newsletterForm").onsubmit=e=>{
  e.preventDefault();
  document.querySelector("#newsletterMsg").textContent="You're on the list.";
  e.target.reset()
};

document.querySelector("#checkoutBtn").onclick=()=>{
  alert("Checkout is ready for payment-provider integration.")
};

document.querySelectorAll('[data-action="search"]').forEach(b=>b.onclick=()=>{
  document.querySelector("#shop").scrollIntoView({behavior:"smooth"})
});

document.querySelectorAll('[data-action="account"]').forEach(b=>b.onclick=()=>{
  alert("Customer accounts can be connected to your e-commerce backend.")
});

document.querySelector(".menu-btn").onclick=()=>{
  alert("Mobile navigation can be expanded here.")
};

updateCount();
renderProducts();

Swal.fire({
  title:"Write your name",
  input:"text",
  inputValidator: (value)=>{
      return !value && "You must enter a name...!!!"
  },
  allowOutsideClick:false
}).then(data=>{
  
  let name=data.value
  document.title=name

  let inputMensaje=document.getElementById("mensaje")
  let divMensajes=document.getElementById("mensajes")
  inputMensaje.focus()
  
  const socket=io()
  
  socket.emit("id", name)

  socket.on("nuevoUsuario", name=>{
      Swal.fire({
          text:`${name} has logged in...!!!`,
          toast:true,
          position:"top-right"
      })
  })

  socket.on("mensajesPrevios", mensajes=>{
      mensajes.forEach(m=>{
          divMensajes.innerHTML+=`<span class="mensaje"><strong>${m.name}</strong> says: <i>${m.mensaje}</i></span><br>`
          divMensajes.scrollTop=divMensajes.scrollHeight
      })
  })

  socket.on("saleUsuario", name=>{
      divMensajes.innerHTML+=`<span class="mensaje"><strong>${name}</strong> has left the chat... :(</span><br>`
      divMensajes.scrollTop=divMensajes.scrollHeight
  })

  inputMensaje.addEventListener("keyup", e=>{
      e.preventDefault()

      if(e.code==="Enter" && e.target.value.trim().length>0){
          socket.emit("mensaje", name, e.target.value.trim())
          e.target.value=""
          e.target.focus()
      }
  })

  socket.on("nuevoMensaje", (name, mensaje)=>{
      divMensajes.innerHTML+=`<span class="mensaje"><strong>${name}</strong> says: <i>${mensaje}</i></span><br>`
      divMensajes.scrollTop=divMensajes.scrollHeight
  })

})
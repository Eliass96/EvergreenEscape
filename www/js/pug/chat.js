function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function chatFriends(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (mensajes, nombreUsuario) {pug_html = pug_html + "\u003Coutput class=\"cardChat\" id=\"chatBox\"\u003E\u003Cdiv class=\"card-inner-chat\"\u003E\u003Cheader class=\"d-flex align-items-center justify-content-center p-3\"\u003E\u003Ch2 class=\"titulo_card_chat\"\u003EChat con \u003Cspan id=\"chatNombreUsuario\"\u003E" + (pug_escape(null == (pug_interp = nombreUsuario) ? "" : pug_interp)) + "\u003C\u002Fspan\u003E\u003C\u002Fh2\u003E\u003Cbutton class=\"btn btn-custom boton_cerrar\" id=\"cerrarChat\"\u003E❌\u003C\u002Fbutton\u003E\u003C\u002Fheader\u003E\u003C!-- Lista de mensajes--\u003E\u003Cul class=\"lista_chat\" id=\"listaMensajes\"\u003E";
// iterate mensajes
;(function(){
  var $$obj = mensajes;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var mensaje = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"d-flex align-items-start\"\u003E\u003Cdiv class=\"mensaje-contenido\"\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = mensaje.content) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var mensaje = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"d-flex align-items-start\"\u003E\u003Cdiv class=\"mensaje-contenido\"\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = mensaje.content) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Ful\u003E\u003C!-- Formulario de mensajes--\u003E\u003Cform class=\"mt-3 px-3 d-flex\" id=\"formularioMensaje\"\u003E\u003Cinput class=\"form-control\" type=\"text\" id=\"mensajeInput\" placeholder=\"Escribe tu mensaje...\"\u002F\u003E\u003Cbutton class=\"btn btn-custom mx-2\" id=\"enviarMensaje\" type=\"button\"\u003E➤\u003C\u002Fbutton\u003E\u003C\u002Fform\u003E\u003C\u002Fdiv\u003E\u003C\u002Foutput\u003E";}.call(this,"mensajes" in locals_for_with?locals_for_with.mensajes:typeof mensajes!=="undefined"?mensajes:undefined,"nombreUsuario" in locals_for_with?locals_for_with.nombreUsuario:typeof nombreUsuario!=="undefined"?nombreUsuario:undefined));;return pug_html;}
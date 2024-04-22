function pug_escape(e){var a=""+e,t=pug_match_html.exec(a);if(!t)return e;var r,c,n,s="";for(r=t.index,c=0;r<a.length;r++){switch(a.charCodeAt(r)){case 34:n="&quot;";break;case 38:n="&amp;";break;case 60:n="&lt;";break;case 62:n="&gt;";break;default:continue}c!==r&&(s+=a.substring(c,r)),c=r+1,s+=n}return c!==r?s+a.substring(c,r):s}
var pug_match_html=/["&<>]/;function crearPuntuacionesPorPais(locals) {var pug_html = "", pug_mixins = {}, pug_interp;;var locals_for_with = (locals || {});(function (jugadores) {pug_html = pug_html + "\u003Coutput class=\"cardRanking\" id=\"rankingPorPais\"\u003E\u003Cdiv class=\"card-inner\"\u003E\u003Cheader class=\"d-flex align-items-center justify-content-center\"\u003E\u003Ch2 class=\"titulo_card_ranking\"\u003EMejores jugadores de tu país\u003C\u002Fh2\u003E\u003C\u002Fheader\u003E\u003Col class=\"lista_ranking\"\u003E";
// iterate jugadores
;(function(){
  var $$obj = jugadores;
  if ('number' == typeof $$obj.length) {
      for (var pug_index0 = 0, $$l = $$obj.length; pug_index0 < $$l; pug_index0++) {
        var jugador = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"texto_ranking d-flex align-items-center justify-content-between\"\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = jugador.nombre) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = jugador.puntuacion + " puntos") ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fli\u003E";
      }
  } else {
    var $$l = 0;
    for (var pug_index0 in $$obj) {
      $$l++;
      var jugador = $$obj[pug_index0];
pug_html = pug_html + "\u003Cli class=\"texto_ranking d-flex align-items-center justify-content-between\"\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = jugador.nombre) ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003Cp\u003E" + (pug_escape(null == (pug_interp = jugador.puntuacion + " puntos") ? "" : pug_interp)) + "\u003C\u002Fp\u003E\u003C\u002Fli\u003E";
    }
  }
}).call(this);

pug_html = pug_html + "\u003C\u002Fol\u003E\u003C\u002Fdiv\u003E\u003C\u002Foutput\u003E";}.call(this,"jugadores" in locals_for_with?locals_for_with.jugadores:typeof jugadores!=="undefined"?jugadores:undefined));;return pug_html;}
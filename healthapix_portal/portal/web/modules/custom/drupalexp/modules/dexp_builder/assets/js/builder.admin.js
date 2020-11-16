!function(e,t){"object"==typeof exports?module.exports=t(e):"function"==typeof define&&define.amd?define("colors",[],function(){return t(e)}):e.Colors=t(e)}(this,function(e,c){"use strict";function n(e,t,r,o,i){if("string"==typeof t)r=(t=q.txt2color(t)).type,O[r]=t[r],i=i!==c?i:t.alpha;else if(t)for(var n in t)e[r][n]=l(t[n]/z[r][n][1],0,1);return i!==c&&(e.alpha=l(+i,0,1)),s(r,o?e:c)}function s(e,t){var r,o,i,n,s,l,a,c,d=t||O,u=q,h=X.options,p=z,f=d.RND,b="",g="",m={hsl:"hsv",rgb:e},v=f.rgb;if("alpha"!==e){for(var x in p)if(!p[x][x])for(b in e!==x&&(g=m[x]||"rgb",d[x]=u[g+"2"+x](d[g])),f[x]||(f[x]={}),r=d[x])f[x][b]=A(r[b]*p[x][b][1]);v=f.rgb,d.HEX=u.RGB2HEX(v),d.equivalentGrey=h.grey.r*d.rgb.r+h.grey.g*d.rgb.g+h.grey.b*d.rgb.b,d.webSave=o=P(v,51),d.webSmart=i=P(v,17),d.saveColor=v.r===o.r&&v.g===o.g&&v.b===o.b?"web save":v.r===i.r&&v.g===i.g&&v.b===i.b?"web smart":"",d.hueRGB=q.hue2RGB(d.hsv.h),t&&(d.background=(n=v,s=d.rgb,l=d.alpha,a=X.options.grey,(c={}).RGB={r:n.r,g:n.g,b:n.b},c.rgb={r:s.r,g:s.g,b:s.b},c.alpha=l,c.equivalentGrey=A(a.r*n.r+a.g*n.g+a.b*n.b),c.rgbaMixBlack=H(s,{r:0,g:0,b:0},l,1),c.rgbaMixWhite=H(s,{r:1,g:1,b:1},l,1),c.rgbaMixBlack.luminance=S(c.rgbaMixBlack,!0),c.rgbaMixWhite.luminance=S(c.rgbaMixWhite,!0),X.options.customBG&&(c.rgbaMixCustom=H(s,X.options.customBG,l,1),c.rgbaMixCustom.luminance=S(c.rgbaMixCustom,!0),X.options.customBG.luminance=S(X.options.customBG,!0)),c))}var y,w,_,k,C,B,M,G,R=d.rgb,E=d.alpha,D="luminance",j=d.background;return(y=H(R,{r:0,g:0,b:0},E,1))[D]=S(y,!0),d.rgbaMixBlack=y,(w=H(R,{r:1,g:1,b:1},E,1))[D]=S(w,!0),d.rgbaMixWhite=w,h.customBG&&((_=H(R,j.rgbaMixCustom,E,1))[D]=S(_,!0),_.WCAG2Ratio=(M=_[D],G=j.rgbaMixCustom[D],A(100*(G<=M?(M+.05)/(G+.05):(G+.05)/(M+.05)))/100),(d.rgbaMixBGMixCustom=_).luminanceDelta=F.abs(_[D]-j.rgbaMixCustom[D]),_.hueDelta=(k=j.rgbaMixCustom,C=_,B=!0,(F.max(k.r-C.r,C.r-k.r)+F.max(k.g-C.g,C.g-k.g)+F.max(k.b-C.b,C.b-k.b))*(B?255:1)/765)),d.RGBLuminance=S(v),d.HUELuminance=S(d.hueRGB),h.convertCallback&&h.convertCallback(d,e),d}function P(e,t){var r={},o=0,i=t/2;for(var n in e)o=e[n]%t,r[n]=e[n]+(i<o?t-o:-o);return r}function S(e,t){for(var r=t?1:255,o=[e.r/r,e.g/r,e.b/r],i=X.options.luminance,n=o.length;n--;)o[n]=o[n]<=.03928?o[n]/12.92:F.pow((o[n]+.055)/1.055,2.4);return i.r*o[0]+i.g*o[1]+i.b*o[2]}function H(e,t,r,o){var i={},n=r!==c?r:1,s=o!==c?o:1,l=n+s*(1-n);for(var a in e)i[a]=(e[a]*n+t[a]*s*(1-n))/l;return i.a=l,i}function l(e,t,r){return r<e?r:e<t?t:e}var z={rgb:{r:[0,255],g:[0,255],b:[0,255]},hsv:{h:[0,360],s:[0,100],v:[0,100]},hsl:{h:[0,360],s:[0,100],l:[0,100]},alpha:{alpha:[0,1]},HEX:{HEX:[0,16777215]}},F=e.Math,A=F.round,X={},O={},t={r:.298954,g:.586434,b:.114612},r={r:.2126,g:.7152,b:.0722},o=function(e){this.colors={RND:{}},this.options={color:"rgba(0,0,0,0)",grey:t,luminance:r,valueRanges:z},i(this,e||{})},i=function(e,t){var r,o=e.options;for(var i in a(e),t)t[i]!==c&&(o[i]=t[i]);r=o.customBG,o.customBG="string"==typeof r?q.txt2color(r).rgb:r,O=n(e.colors,o.color,c,!0)},a=function(e){X!==e&&(O=(X=e).colors)};o.prototype.setColor=function(e,t,r){return a(this),e?n(this.colors,e,t,c,r):(r!==c&&(this.colors.alpha=l(r,0,1)),s(t))},o.prototype.setCustomBackground=function(e){return a(this),this.options.customBG="string"==typeof e?q.txt2color(e).rgb:e,n(this.colors,c,"rgb")},o.prototype.saveAsBackground=function(){return a(this),n(this.colors,c,"rgb",!0)},o.prototype.toString=function(e,t){return q.color2text((e||"rgb").toLowerCase(),this.colors,t)};var q={txt2color:function(e){var t={},r=e.replace(/(?:#|\)|%)/g,"").split("("),o=(r[1]||"").split(/,\s*/),i=r[1]?r[0].substr(0,3):"rgb",n="";if(t.type=i,t[i]={},r[1])for(var s=3;s--;)n=i[s]||i.charAt(s),t[i][n]=+o[s]/z[i][n][1];else t.rgb=q.HEX2rgb(r[0]);return t.alpha=o[3]?+o[3]:1,t},color2text:function(e,t,r){var o=!1!==r&&A(100*t.alpha)/100,i="number"==typeof o&&!1!==r&&(r||1!==o),n=t.RND.rgb,s=t.RND.hsl,l="hex"===e&&i,a="hex"===e&&!l,c="rgb"===e||l?n.r+", "+n.g+", "+n.b:a?"#"+t.HEX:s.h+", "+s.s+"%, "+s.l+"%";return a?c:(l?"rgb":e)+(i?"a":"")+"("+c+(i?", "+o:"")+")"},RGB2HEX:function(e){return((e.r<16?"0":"")+e.r.toString(16)+(e.g<16?"0":"")+e.g.toString(16)+(e.b<16?"0":"")+e.b.toString(16)).toUpperCase()},HEX2rgb:function(e){return{r:+("0x"+(e=e.split(""))[0]+e[e[3]?1:0])/255,g:+("0x"+e[e[3]?2:1]+(e[3]||e[1]))/255,b:+("0x"+(e[4]||e[2])+(e[5]||e[2]))/255}},hue2RGB:function(e){var t=6*e,r=~~t%6,o=6===t?0:t-r;return{r:A(255*[1,1-o,0,0,o,1][r]),g:A(255*[o,1,1,1-o,0,0][r]),b:A(255*[0,0,o,1,1,1-o][r])}},rgb2hsv:function(e){var t,r,o=e.r,i=e.g,n=e.b,s=0;return i<n&&(i=n+(n=i,0),s=-1),r=n,o<i&&(o=i+(i=o,0),s=-2/6-s,r=F.min(i,n)),t=o-r,{h:(o?t/o:0)<1e-15?O&&O.hsl&&O.hsl.h||0:t?F.abs(s+(i-n)/(6*t)):0,s:o?t/o:O&&O.hsv&&O.hsv.s||0,v:o}},hsv2rgb:function(e){var t=6*e.h,r=e.s,o=e.v,i=~~t,n=t-i,s=o*(1-r),l=o*(1-n*r),a=o*(1-(1-n)*r),c=i%6;return{r:[o,l,s,s,a,o][c],g:[a,o,o,l,s,s][c],b:[s,s,a,o,o,l][c]}},hsv2hsl:function(e){var t=(2-e.s)*e.v,r=e.s*e.v;return r=e.s?t<1?t?r/t:0:r/(2-t):0,{h:e.h,s:e.v||r?r:O&&O.hsl&&O.hsl.s||0,l:t/2}},rgb2hsl:function(e,t){var r=q.rgb2hsv(e);return q.hsv2hsl(t?r:O.hsv=r)},hsl2rgb:function(e){var t=6*e.h,r=e.s,o=e.l,i=o<.5?o*(1+r):o+r-r*o,n=o+o-i,s=~~t,l=i*(i?(i-n)/i:0)*(t-s),a=n+l,c=i-l,d=s%6;return{r:[i,c,n,n,a,i][d],g:[a,i,i,c,n,n][d],b:[n,n,a,i,i,c][d]}}};return o}),function(r,o){"object"==typeof exports?module.exports=o(r,require("jquery"),require("colors")):"function"==typeof define&&define.amd?define(["jquery","colors"],function(e,t){return o(r,e,t)}):o(r,r.jQuery,r.Colors)}(this,function(n,s,t,b){"use strict";function l(e){return e.value||e.getAttribute("value")||s(e).css("background-color")||"#FFF"}function i(e){return(e=e.originalEvent&&e.originalEvent.touches?e.originalEvent.touches[0]:e).originalEvent?e.originalEvent:e}function a(e){return s(e.find(v.doRender)[0]||e[0])}function r(e){var t=s(this),r=t.offset(),o=s(n),i=v.gap;e?((x=a(t))._colorMode=x.data("colorMode"),p.$trigger=t,(f||(s("head")[v.cssPrepend?"prepend":"append"]('<style type="text/css" id="tinyColorPickerStyles">'+(v.css||H)+(v.cssAddon||"")+"</style>"),s(S).css({margin:v.margin}).appendTo("body").show(0,function(){p.$UI=f=s(this),j=v.GPU&&f.css("perspective")!==b,y=s(".cp-z-slider",this),w=s(".cp-xy-slider",this),_=s(".cp-xy-cursor",this),k=s(".cp-z-cursor",this),C=s(".cp-alpha",this),B=s(".cp-alpha-cursor",this),v.buildCallback.call(p,f),f.prepend("<div>").children().eq(0).css("width",f.children().eq(0).width()),f._width=this.offsetWidth,f._height=this.offsetHeight}).hide())).css(v.positionCallback.call(p,t)||{left:(f._left=r.left)-(0<(f._left+=f._width-(o.scrollLeft()+o.width()))+i?f._left+i:0),top:(f._top=r.top+t.outerHeight())-(0<(f._top+=f._height-(o.scrollTop()+o.height()))+i?f._top+i:0)}).show(v.animationSpeed,function(){!0!==e&&(C.toggle(!!v.opacity)._width=C.width(),w._width=w.width(),w._height=w.height(),y._height=y.height(),m.setColor(l(x[0])),h(!0))}).off(".tcp").on(E,".cp-xy-slider,.cp-z-slider,.cp-alpha",c)):p.$trigger&&s(f).hide(v.animationSpeed,function(){h(!1),p.$trigger=null}).off(".tcp")}function c(e){var t=this.className.replace(/cp-(.*?)(?:\s*|$)/,"$1").replace("-","_");1<(e.button||e.which)||(e.preventDefault&&e.preventDefault(),e.returnValue=!1,x._offset=s(this).offset(),(t="xy_slider"===t?o:"z_slider"===t?d:u)(e),h(),M.on(D,function(){M.off(".tcp")}).on(R,function(e){t(e),h()}))}function o(e){var t=i(e),r=t.pageX-x._offset.left,o=t.pageY-x._offset.top;m.setColor({s:r/w._width*100,v:100-o/w._height*100},"hsv")}function d(e){var t=i(e).pageY-x._offset.top;m.setColor({h:360-t/y._height*360},"hsv")}function u(e){var t=(i(e).pageX-x._offset.left)/C._width;m.setColor({},"rgb",t)}function h(e){var t=m.colors,r=t.hueRGB,o=(t.RND.rgb,t.RND.hsl,v.dark),i=v.light,n=m.toString(x._colorMode,v.forceAlpha),s=.22<t.HUELuminance?o:i,l=.22<t.rgbaMixBlack.luminance?o:i,a=(1-t.hsv.h)*y._height,c=t.hsv.s*w._width,d=(1-t.hsv.v)*w._height,u=t.alpha*C._width,h=j?"translate3d":"",p=x[0].value,f=x[0].hasAttribute("value")&&""===p&&e!==b;w._css={backgroundColor:"rgb("+r.r+","+r.g+","+r.b+")"},_._css={transform:h+"("+c+"px, "+d+"px, 0)",left:j?"":c,top:j?"":d,borderColor:.22<t.RGBLuminance?o:i},k._css={transform:h+"(0, "+a+"px, 0)",top:j?"":a,borderColor:"transparent "+s},C._css={backgroundColor:"#"+t.HEX},B._css={transform:h+"("+u+"px, 0, 0)",left:j?"":u,borderColor:l+" transparent"},x._css={backgroundColor:f?"":n,color:f?"":.22<t.rgbaMixBGMixCustom.luminance?o:i},x.text=f?"":p!==n?n:"",e!==b?g(e):P(g)}function g(e){w.css(w._css),_.css(_._css),k.css(k._css),C.css(C._css),B.css(B._css),v.doRender&&x.css(x._css),x.text&&x.val(x.text),v.renderCallback.call(p,x,"boolean"==typeof e?e:b)}var p,m,v,x,f,y,w,_,k,C,B,M=s(document),G=s(),R="touchmove.tcp mousemove.tcp pointermove.tcp",E="touchstart.tcp mousedown.tcp pointerdown.tcp",D="touchend.tcp mouseup.tcp pointerup.tcp",j=!1,P=n.requestAnimationFrame||n.webkitRequestAnimationFrame||function(e){e()},S='<div class="cp-color-picker"><div class="cp-z-slider"><div class="cp-z-cursor"></div></div><div class="cp-xy-slider"><div class="cp-white"></div><div class="cp-xy-cursor"></div></div><div class="cp-alpha"><div class="cp-alpha-cursor"></div></div></div>',H=".cp-color-picker{position:absolute;overflow:hidden;padding:6px 6px 0;background-color:#444;color:#bbb;font-family:Arial,Helvetica,sans-serif;font-size:12px;font-weight:400;cursor:default;border-radius:5px}.cp-color-picker>div{position:relative;overflow:hidden}.cp-xy-slider{float:left;height:128px;width:128px;margin-bottom:6px;background:linear-gradient(to right,#FFF,rgba(255,255,255,0))}.cp-white{height:100%;width:100%;background:linear-gradient(rgba(0,0,0,0),#000)}.cp-xy-cursor{position:absolute;top:0;width:10px;height:10px;margin:-5px;border:1px solid #fff;border-radius:100%;box-sizing:border-box}.cp-z-slider{float:right;margin-left:6px;height:128px;width:20px;background:linear-gradient(red 0,#f0f 17%,#00f 33%,#0ff 50%,#0f0 67%,#ff0 83%,red 100%)}.cp-z-cursor{position:absolute;margin-top:-4px;width:100%;border:4px solid #fff;border-color:transparent #fff;box-sizing:border-box}.cp-alpha{clear:both;width:100%;height:16px;margin:6px 0;background:linear-gradient(to right,#444,rgba(0,0,0,0))}.cp-alpha-cursor{position:absolute;margin-left:-4px;height:100%;border:4px solid #fff;border-color:#fff transparent;box-sizing:border-box}",z=function(e){m=this.color=new t(e),v=m.options,p=this};z.prototype={render:h,toggle:r},s.fn.colorPicker=function(o){var t=this,e=function(){};return o=s.extend({animationSpeed:150,GPU:!0,doRender:!0,customBG:"#FFF",opacity:!0,renderCallback:e,buildCallback:e,positionCallback:e,body:document.body,scrollResize:!0,gap:4,dark:"#222",light:"#DDD"},o),!p&&o.scrollResize&&s(n).on("resize.tcp scroll.tcp",function(){p.$trigger&&p.toggle.call(p.$trigger[0],!0)}),G=G.add(this),this.colorPicker=p||new z(o),this.options=o,s(o.body).off(".tcp").on(E,function(e){-1===G.add(f).add(s(f).find(e.target)).index(e.target)&&r()}),this.on("focusin.tcp click.tcp",function(e){p.color.options=s.extend(p.color.options,v=t.options),r.call(this,e)}).on("change.tcp",function(){m.setColor(this.value||"#FFF"),t.colorPicker.render(!0)}).each(function(){var e=l(this),t=e.split("("),r=a(s(this));r.data("colorMode",t[1]?t[0].substr(0,3):"HEX").attr("readonly",v.preventFocus),o.doRender&&r.css({"background-color":e,color:function(){return.22<m.setColor(e).rgbaMixBGMixCustom.luminance?o.dark:o.light}})})},s.fn.colorPicker.destroy=function(){s("*").off(".tcp"),p.toggle(!1),G=s()}}),function(a,c){c.dexp_builder=c.dexp_builder||{},c.dexp_builder.ajax=function(e){return"modal"==(e.dialogType||"")&&(e.success=function(e,t){this.progress.element&&a(this.progress.element).remove(),this.progress.object&&this.progress.object.stopMonitoring(),a(this.element).prop("disabled",!1);var r=a(this.element).parents("[data-drupal-selector]").addBack().toArray(),o=!1;for(var i in e)e.hasOwnProperty(i)&&e[i].command&&this.commands[e[i].command]&&("openDialog"==e[i].command&&(e[i].selector=this.dialog.selector||"#dexp-builder-modal"),this.commands[e[i].command](this,e[i],t),"invoke"===e[i].command&&"focus"===e[i].method&&(o=!0));if(!o&&this.element&&!a(this.element).data("disable-refocus")){for(var n=!1,s=r.length-1;!n&&0<s;s--)n=document.querySelector('[data-drupal-selector="'+r[s].getAttribute("data-drupal-selector")+'"]');n&&a(n).trigger("focus")}if(this.$form){var l=this.settings||drupalSettings;c.attachBehaviors(this.$form.get(0),l)}this.settings=null}),c.ajax(e)},c.behaviors.dexp_builder_modal={attach:function(e,t){a(".dexp-builder-modal").once("click").each(function(){a(this).click(function(e){e.preventDefault(),c.dexp_builder.ajax({url:a(this).attr("href"),dialog:{width:"80%"},dialogType:"modal",progress:{type:"fullscreen"}}).execute()})}),a(".icon-select").once("js").each(function(){a('<div class="icon-selector"><span class="selected-icon"><i class="'+a(this).val()+'"></i></span><span class="selector-button"><i class="fa-arrow-down fip-fa fa"></i></span></div> <a class="remove-icon" href="#"><small>'+c.t("Remove")+"</small></a>").insertAfter(this),a(".selector-button").click(function(e){e.preventDefault(),c.dexp_builder.ajax({url:c.url("dexp_buider/icons"),dialog:{width:"60%",selector:"#dexp-builder-icon-select"},submit:{icon_library:a("input[name=icon_library]").val()},dialogType:"modal",progress:{type:"fullscreen"}}).execute()}),a("a.remove-icon").click(function(e){e.preventDefault(),a(this).closest(".form-item").find("input[name=icon]").val(""),a(this).closest(".form-item").find(".selected-icon").html("")})}),a("input[data-drupal-selector=edit-search]").once("keyup").each(function(){a(this).keyup(function(){var e=a.trim(a(this).val());""!==e?(a(".icon-button").hide(),a('.icon-button[data-class*="'+e+'"]').show()):a(".icon-button").show()})}),a("select[data-drupal-selector=edit-library]").once("change").each(function(){a(this).change(function(){a("input[data-drupal-selector=edit-search]").val("").trigger("keyup")})}),a(".icon-button").once("click").each(function(){a(this).click(function(){a(this).closest("form").find("input[name=icon]").val(a(this).data("class")),a(this).closest("form").find("input[type=submit]").trigger("click")})})}}}(jQuery,Drupal,drupalSettings),function(n,s,e){var o=!0;window.onload=function(){window.addEventListener("beforeunload",function(e){if(!o){var t="It looks like you have been editing something. If you leave before saving, your changes will be lost.";return(e||window.event).returnValue=t}})},s.behaviors.dexp_builder={attach:function(e,t){n("select.filter-list",e).once("dexp_builder_change").each(function(){n(this).data("previous",n(this).val()),n(this).on("focus",function(){n(this).data("previous",n(this).val())}).on("change",function(){n(this);if("drupalexp_builder"===n(this).val().toString()){o=!1,n(this).closest(".text-format-wrapper").addClass("dexp-builder-enable");var e=n(this).val();n(".dexp-builder").each(function(){s.ajax({url:s.url("dexp_builder/parse"),submit:{format:e,text:n("[id="+n(this).data("id")+"]").val(),selector:"#"+n(this).attr("id")+" .dexp-builder-inner"}}).execute()})}else o=!0,"drupalexp_builder"===n(this).data("previous")&&n(".dexp-builder").each(function(){var e=n(this);try{var t=s.builderExport(e.find(">.dexp-builder-inner").find(".builder-element:first").parent());n("#"+e.data("id")).val(t)}catch(e){return alert("Failed"),console.log(e),!1}}),n(this).closest(".text-format-wrapper").removeClass("dexp-builder-enable")}).trigger("change")}),n(".text-summary-wrapper").once("trigger").each(function(){var e=n(this);setInterval(function(){e.is(":visible")?e.next(".dexp-builder").attr("css",""):e.next(".dexp-builder").hide()},500)}),n(".add-element").once("click").each(function(){n(this).click(function(){n(this);var e=n(this).closest(".dexp-builder");n(".active-element-content").removeClass("active-element-content"),0===n(this).closest(".builder-element").length?0<n(".dexp-builder-inner",e).find(".builder-element:first").length?n(".dexp-builder-inner",e).find(".builder-element:first").parent().addClass("active-element-content"):0<n(".dexp-builder-inner",e).find(">div").length?n(".dexp-builder-inner",e).find(">div").addClass("active-element-content"):n(".dexp-builder-inner",e).addClass("active-element-content"):n(this).closest(".builder-element").find(".element-content:first").addClass("active-element-content"),s.dexp_builder.ajax({url:s.url("dexp_builder/shortcode_list"),dialog:{width:"80%"},dialogType:"modal",progress:{type:"fullscreen"},selector:"body",submit:{format:n(this).closest(".text-format-wrapper").find("select.filter-list").val(),action:"add",text:"",parent:n(this).closest(".builder-element").data("shortcodeId")||""}}).execute()})}),n(".edit-element").once("click").each(function(){n(this).click(function(e){e.preventDefault(),n(".builder-element").removeClass("active-element");var t=n(this).closest(".builder-element");t.addClass("active-element"),s.dexp_builder.ajax({url:s.url("dexp_builder/shortcode_settings/"+t.data("shortcode-id")+"/edit"),dialog:{width:"80%"},progress:{type:"fullscreen"},dialogType:"modal",submit:{shortcode_id:t.data("shortcode-id"),format:n(this).closest(".text-format-wrapper").find("select.filter-list").val(),selector:".element-content.active-element",attr:t.data("attr"),text:s.builderExport(t.find(".element-content:first"))}}).execute()})}),n(".clone-element").once("click").each(function(){n(this).click(function(){n(this).closest(".builder-element").clone().appendTo(n(this).closest(".builder-element").parent()),s.attachBehaviors(n(this).closest(".builder-element").parent().get(0),t)})}),n(".delete-element").once("click").each(function(){n(this).click(function(){confirm(s.t("Delete element?"))&&n(this).closest(".builder-element").remove()})}),n(".toggle-element").once("click").each(function(){n(this).click(function(){n(this).toggleClass("fa-caret-left fa-sort-desc"),n(this).closest(".builder-element").toggleClass("collapse");var e=n(this).closest(".builder-element").data("attr");e.collapse=n(this).closest(".builder-element").hasClass("collapse"),n(this).closest(".builder-element").data("attr",e)})}),n(".element-content.has-child").sortable({placeholder:"dexp-builder-sortable-placeholder",connectWith:".element-content, .dexp-builder-inner > div",handle:".element-toolbar .fa-arrows",helper:"clone",forceHelperSize:!0,start:function(e,t){var r=t.item.data("attr");r.hasOwnProperty("xl")&&t.placeholder.addClass("col-xl-"+r.xl),r.hasOwnProperty("lg")&&t.placeholder.addClass("col-lg-"+r.lg),r.hasOwnProperty("md")&&t.placeholder.addClass("col-md-"+r.md),r.hasOwnProperty("sm")&&t.placeholder.addClass("col-sm-"+r.sm),r.hasOwnProperty("xs")&&t.placeholder.addClass("col-"+r.xs)}}),n(".dexp-builder-inner").find(".builder-element:first").parent().sortable({placeholder:"dexp-builder-sortable-placeholder",connectWith:".element-content",handle:".element-toolbar .fa-arrows",helper:"clone",forceHelperSize:!0,start:function(e,t){var r=t.item.data("attr");r.hasOwnProperty("xl")&&t.placeholder.addClass("col-xl-"+r.lg),r.hasOwnProperty("lg")&&t.placeholder.addClass("col-lg-"+r.lg),r.hasOwnProperty("md")&&t.placeholder.addClass("col-md-"+r.md),r.hasOwnProperty("sm")&&t.placeholder.addClass("col-sm-"+r.sm),r.hasOwnProperty("xs")&&t.placeholder.addClass("col-"+r.xs)}}),n(".dexp-builder").once("form-submit").each(function(){var r=n(this);r.closest("form").on("submit",function(e){if(!(o=!0)===r.closest(".text-format-wrapper").hasClass("dexp-builder-enable"))return!0;if(r.closest(".text-format-wrapper").hasClass("dexp-builder-enable"))try{var t=s.builderExport(r.find(">.dexp-builder-inner").find(".builder-element:first").parent());n("#"+r.data("id")).val(t)}catch(e){return alert("Oop! Something went wrong."),console.log(e),o=!1}})})}},s.builderExport=function(e){var o=[],i=[],t="";if(n(e).is(".builder-element"))return t=n(e).data("shortcodeId"),n.each(n(e).data("attr"),function(e,t){if("html_content"===e){var r=!1;try{r=n(t).is("[data-shortcode-id]")}catch(e){r=!1}!1===r&&i.push(t)}else o.push(e+"='"+t+"'")}),n(e).find(".element-content:first").find(">.builder-element").each(function(e){0===e&&(i=[]),i.push(s.builderExport(this))}),"["+t+" "+o.join(" ")+"]"+i.join("")+"[/"+t+"]";var r="";return n(e).find(">.builder-element").each(function(){r+=s.builderExport(this)}),r}}(jQuery,Drupal,drupalSettings),function(e,t){Drupal.behaviors.color_picker={attach:function(){e("input.color").once("colorpicker").each(function(){var r=e(this);e(this).colorPicker({renderCallback:function(e,t){""!=e.val()&&r.val(this.color.toString("HEX"))}})})}}}(jQuery);
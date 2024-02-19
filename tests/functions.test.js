const register = require("./functions");

//Verifica se o user com todos os campos corretos é validado
test("User successfully validated",  ()=>{
   register.validateUser("ffdf", "12345", "danfie@gmail.com" ,
   "Danifela", "Menfdes", "911025551").then((response) =>{
       expect(response).toBe(409);
   });
});

//Verifica se o user é validado com email inválido
test("User not validated: invalid email",  ()=>{
   register.validateUser("1234", "1234", "ddsdfsd" ,
   "Daniefla", "Mefndes", "989061551").then((response) =>{
       expect(response).toBe(409);
   });
});

//Verifica se o user é validado com email já existe
test("User not validated: email allready exists", ()=> {
   register.validateUser("1234", "1234", "vafnia@gmail.com",
   "Daniefla", "Menfdes", "912361551").then((response) =>{
       expect(response).toBe(200);
   });
});

//Verifica se o user é validado com username já existe
test("User not validated: username allready exists", ()=> {
   register.validateUser("vania", "12345", "danidfe@gmail.com",
   "Dafnifedla", "Mfenfddes", "895236541").then((response) =>{
       expect(response).toBe(200);
   });
})
//Verifica se o user é validado com phone inválido
test("User not validated: invalid phone", ()=> {
   register.validateUser("1234", "1234", "danerdie@gmail.com",
   "Dasdfniela", "Mfffendes", "0780").then((response) =>{
      expect(response).toBe(200);
   });

});


//Veirifica se phone number é valido
test("Phone number is valid", () => {
   const response=register.isValidPhoneNumber("985678956");
      expect(response).toBe(true);
   });

test("Phone number is not valid", () => {
   const response=register.isValidPhoneNumber("911061");
      expect(response).toBe(false);
   });



test("photo updated with sucess",  ()=>{
   register.updatePhoto("vania", "1234", "https://www.bing.com/images/search?view=detailV2&ccid=E8rR1%2bBU&id=E628E314F244CBDFCAC95ED777ADE749FBF9ADAE&thid=OIP.E8rR1-BUCOWIHpS78uukkAHaEK&mediaurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.13cad1d7e05408e5881e94bbf2eba490%3frik%3drq35%252b0nnrXfXXg%26riu%3dhttp%253a%252f%252f1.bp.blogspot.com%252f-Dy42UBkxXXc%252fU4P9llH1IWI%252fAAAAAAAAD-I%252fMT2evyWmGFw%252fs1600%252fimagens-imagens-paisagens-natureza-758ab5.jpg%26ehk%3daMOFfe5Gxh8ql7CG6bP47W0%252bpg0otCjSiZ%252f37kNuRmA%253d%26risl%3d%26pid%3dImgRaw%26r%3d0&exph=900&expw=1600&q=imagem&simid=608035643125535435&FORM=IRPRST&ck=22D376B96454479050A87180DF7334B7&selectedIndex=0&itb=0&idpp=overlayview&ajaxhist=0&ajaxserp=0").then((response) =>{
       expect(response).toBe(200);
   });
});

test("photo updated failed",  ()=>{
   register.updatePhoto("vania", "1234", "jhsdffgghfgh").then((response) =>{
       expect(response).toBe(400);
   });
});


test("email is valid", () => {
   expect(register.isValidEmail("33345@gmail.com")).toBe(true)
});
test("email is not valid", () => {
   expect(register.isValidEmail("sdcjbsjdfvbjhdfbvbsss")).toBe(false)
});







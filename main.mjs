import { fb_authenticate, fb_write, fb_game, fb_readsorted}
    from './script.mjs';
    window.fb_authenticate      = fb_authenticate;
    window.fb_write     = fb_write;
    window.fb_game     = fb_game;
    window.fb_readsorted    = fb_readsorted;
    document.getElementById("demo").innerHTML = "hi";
    //poo
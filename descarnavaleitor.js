// ==UserScript==
// @name        Descarnavaleitor
// @description Bloqueia notícias de carnaval
// @match       *://g1.globo.com/*
// @match       *://www.uol.com.br/*
// ==/UserScript==

"use strict";

const blocklist = [
    // geral
    'carnaval',
    'desfile',
    'desfiles',
    'enredo',
    'desfilar',
    'bloco',
    'folia',
    'cordão',
    'sambódromo',
    'fantasia',
    'acadêmicos',
    'mocidade',
    'unidos',
    'galo da madrugada',
    'bola preta',
    'megablocos',

    // sp
    'gaviões',
    'mancha',
    'vai-vai',
    'camisa verde e branco',
    'barroca zona sul',
    'dragões',
    'independente tricolor',
    'acadêmicos do tatuapé',
    'rosas de ouro',
    'tom maior',
    'águia de ouro',
    'império de casa verde',
    'dom bosco',
    'torcida jovem',
    'nenê',
    'pérola negra',
    'colorado do brás',
    'estrela do terceiro milênio',

    // rj
    'sapucaí',
    'beija-flor',
    'imperatriz leopoldinense',
    'portela',
    'mangueira',
    'tuiuti',
    'viradouro',
    'união do parque acari',
    'império da tijuca',
    'acadêmicos de vigário geral',
    'inocentes de belford roxo',
    'estácio de sá',
    'união de maricá',
    'acadêmicos de niterói',
    'sereno de campo grande',
    'em cima da hora',
    'arranco',
    'união da ilha do governador',
    'são clemente',
    'império serrano',
];

const blocklist_lowercase = blocklist.map(it => it.toLowerCase());

class SiteCleaner {
    clean() {
        let posts = this.search();

        posts.forEach((post) => {
            let text = post.innerText.toLowerCase();
            let should_block = blocklist.some(it => text.includes(it));
            if (should_block) {
                console.log('Descarnavalado: ' + text);
                post.remove();
            }
        });
    }
}

class G1Cleaner extends SiteCleaner {
    search() {
        return document.querySelectorAll('.feed-post-body, .bstn-hl-wrapper');
    }
}

class UolCleaner extends SiteCleaner {
    search() {
        return document.querySelectorAll('.section__grid__highlight, .headlineMain, .cardGroup__headline, .headlineSub, .headlineStandard, .headlinePhotoBrand, .headlinePhoto, .headlineHorizontal');
    }
}

const site_handlers = {
    'g1.globo.com/': new G1Cleaner(),
    'www.uol.com.br/': new UolCleaner()
};

const url = document.URL.replace('https://', '').replace('http://', '');

const should_filter = url in site_handlers;

if (url in site_handlers) {
    console.log('Descarnavaleitor: ' + url);
    const observer = new MutationObserver((mutationList, observer) => {

        mutationList.forEach(mutation => {
            if (mutation.type === 'childList') {
                site_handlers[url].clean();
            }
        });
    });

    observer.observe(
        document.body, { attributes: true, childList: true, subtree: true }
    );

    const on_lold = document.body.onload;
    document.body.onload = () => {
        if (on_lold !== null) on_lold();
        site_handlers[url].clean();
    }
}

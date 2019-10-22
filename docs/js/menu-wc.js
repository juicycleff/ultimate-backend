'use strict';


customElements.define('compodoc-menu', class extends HTMLElement {
    constructor() {
        super();
        this.isNormalMode = this.getAttribute('mode') === 'normal';
    }

    connectedCallback() {
        this.render(this.isNormalMode);
    }

    render(isNormalMode) {
        let tp = lithtml.html(`
        <nav>
            <ul class="list">
                <li class="title">
                    <a href="index.html" data-type="index-link">ultimate-backend documentation</a>
                </li>

                <li class="divider"></li>
                ${ isNormalMode ? `<div id="book-search-input" role="search"><input type="text" placeholder="Type to search"></div>` : '' }
                <li class="chapter">
                    <a data-type="chapter-link" href="index.html"><span class="icon ion-ios-home"></span>Getting started</a>
                    <ul class="links">
                        <li class="link">
                            <a href="overview.html" data-type="chapter-link">
                                <span class="icon ion-ios-keypad"></span>Overview
                            </a>
                        </li>
                        <li class="link">
                            <a href="index.html" data-type="chapter-link">
                                <span class="icon ion-ios-paper"></span>README
                            </a>
                        </li>
                                <li class="link">
                                    <a href="dependencies.html" data-type="chapter-link">
                                        <span class="icon ion-ios-list"></span>Dependencies
                                    </a>
                                </li>
                    </ul>
                </li>
                    <li class="chapter modules">
                        <a data-type="chapter-link" href="modules.html">
                            <div class="menu-toggler linked" data-toggle="collapse" ${ isNormalMode ?
                                'data-target="#modules-links"' : 'data-target="#xs-modules-links"' }>
                                <span class="icon ion-ios-archive"></span>
                                <span class="link-name">Modules</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                        </a>
                        <ul class="links collapse " ${ isNormalMode ? 'id="modules-links"' : 'id="xs-modules-links"' }>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' : 'data-target="#xs-controllers-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' :
                                            'id="xs-controllers-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' : 'data-target="#xs-injectables-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' :
                                        'id="xs-injectables-links-module-AppModule-a8b4fa0eb2681c7d8ecd1b911f9c2e50"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' : 'data-target="#xs-controllers-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' :
                                            'id="xs-controllers-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' : 'data-target="#xs-injectables-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' :
                                        'id="xs-injectables-links-module-AppModule-7e38df145c406db1e6406da332d5b3b3-1"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' : 'data-target="#xs-controllers-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' :
                                            'id="xs-controllers-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' : 'data-target="#xs-injectables-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' :
                                        'id="xs-injectables-links-module-AppModule-c531329d698442fcf45125b75a8619b0-2"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AppModule.html" data-type="entity-link">AppModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' : 'data-target="#xs-controllers-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' :
                                            'id="xs-controllers-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' }>
                                            <li class="link">
                                                <a href="controllers/AppController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AppController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' : 'data-target="#xs-injectables-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' :
                                        'id="xs-injectables-links-module-AppModule-66519c54754e92ac7eb5cd1feb9ba77b-3"' }>
                                        <li class="link">
                                            <a href="injectables/AppService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AppService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/AuthModule.html" data-type="entity-link">AuthModule</a>
                                    <li class="chapter inner">
                                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                            'data-target="#controllers-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' : 'data-target="#xs-controllers-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' }>
                                            <span class="icon ion-md-swap"></span>
                                            <span>Controllers</span>
                                            <span class="icon ion-ios-arrow-down"></span>
                                        </div>
                                        <ul class="links collapse" ${ isNormalMode ? 'id="controllers-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' :
                                            'id="xs-controllers-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' }>
                                            <li class="link">
                                                <a href="controllers/AuthController.html"
                                                    data-type="entity-link" data-context="sub-entity" data-context-id="modules">AuthController</a>
                                            </li>
                                        </ul>
                                    </li>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' : 'data-target="#xs-injectables-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' :
                                        'id="xs-injectables-links-module-AuthModule-dbba428adc0904949803b47d5d474acc"' }>
                                        <li class="link">
                                            <a href="injectables/AuthService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthService</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/CookieSerializer.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CookieSerializer</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/FacebookStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>FacebookStrategy</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/LocalStrategy.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>LocalStrategy</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CommonModule.html" data-type="entity-link">CommonModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CommonModule-74e90394ff9d92eb9e0486dd0f0249cb"' : 'data-target="#xs-injectables-links-module-CommonModule-74e90394ff9d92eb9e0486dd0f0249cb"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CommonModule-74e90394ff9d92eb9e0486dd0f0249cb"' :
                                        'id="xs-injectables-links-module-CommonModule-74e90394ff9d92eb9e0486dd0f0249cb"' }>
                                        <li class="link">
                                            <a href="injectables/CommonService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CommonService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/CoreModule.html" data-type="entity-link">CoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-CoreModule-c4996974733144d3dae0bb65a724e1b0"' : 'data-target="#xs-injectables-links-module-CoreModule-c4996974733144d3dae0bb65a724e1b0"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-CoreModule-c4996974733144d3dae0bb65a724e1b0"' :
                                        'id="xs-injectables-links-module-CoreModule-c4996974733144d3dae0bb65a724e1b0"' }>
                                        <li class="link">
                                            <a href="injectables/CoreService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>CoreService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/GraphqlDistributedGatewayModule.html" data-type="entity-link">GraphqlDistributedGatewayModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/GraphqlDistributedModule.html" data-type="entity-link">GraphqlDistributedModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-GraphqlDistributedModule-3952c160952bdd6ff4e4fd71625258ed"' : 'data-target="#xs-injectables-links-module-GraphqlDistributedModule-3952c160952bdd6ff4e4fd71625258ed"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-GraphqlDistributedModule-3952c160952bdd6ff4e4fd71625258ed"' :
                                        'id="xs-injectables-links-module-GraphqlDistributedModule-3952c160952bdd6ff4e4fd71625258ed"' }>
                                        <li class="link">
                                            <a href="injectables/GraphQLTypesLoader.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GraphQLTypesLoader</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/GraphqlDistributedFactory.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>GraphqlDistributedFactory</a>
                                        </li>
                                        <li class="link">
                                            <a href="injectables/ReferencesExplorerService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ReferencesExplorerService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/MongoCoreModule.html" data-type="entity-link">MongoCoreModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/MongoModule.html" data-type="entity-link">MongoModule</a>
                            </li>
                            <li class="link">
                                <a href="modules/NestCasbinModule.html" data-type="entity-link">NestCasbinModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NestCasbinModule-2815dcc1b963f2b20479b2bd199904ad"' : 'data-target="#xs-injectables-links-module-NestCasbinModule-2815dcc1b963f2b20479b2bd199904ad"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NestCasbinModule-2815dcc1b963f2b20479b2bd199904ad"' :
                                        'id="xs-injectables-links-module-NestCasbinModule-2815dcc1b963f2b20479b2bd199904ad"' }>
                                        <li class="link">
                                            <a href="injectables/NestCasbinService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NestCasbinService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NestjsEventStoreModule.html" data-type="entity-link">NestjsEventStoreModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NestjsEventStoreModule-fc1ab0dd656656a2659e3899fb3ea52d"' : 'data-target="#xs-injectables-links-module-NestjsEventStoreModule-fc1ab0dd656656a2659e3899fb3ea52d"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NestjsEventStoreModule-fc1ab0dd656656a2659e3899fb3ea52d"' :
                                        'id="xs-injectables-links-module-NestjsEventStoreModule-fc1ab0dd656656a2659e3899fb3ea52d"' }>
                                        <li class="link">
                                            <a href="injectables/NestjsEventStoreService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NestjsEventStoreService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/NestMultiTenantModule.html" data-type="entity-link">NestMultiTenantModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-NestMultiTenantModule-524ff400de69980d786f4fb56d065169"' : 'data-target="#xs-injectables-links-module-NestMultiTenantModule-524ff400de69980d786f4fb56d065169"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-NestMultiTenantModule-524ff400de69980d786f4fb56d065169"' :
                                        'id="xs-injectables-links-module-NestMultiTenantModule-524ff400de69980d786f4fb56d065169"' }>
                                        <li class="link">
                                            <a href="injectables/NestMultiTenantService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>NestMultiTenantService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/ProjectModule.html" data-type="entity-link">ProjectModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-ProjectModule-9c81ce5f22e511cabad91770ff5fd8bf"' : 'data-target="#xs-injectables-links-module-ProjectModule-9c81ce5f22e511cabad91770ff5fd8bf"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-ProjectModule-9c81ce5f22e511cabad91770ff5fd8bf"' :
                                        'id="xs-injectables-links-module-ProjectModule-9c81ce5f22e511cabad91770ff5fd8bf"' }>
                                        <li class="link">
                                            <a href="injectables/ProjectService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>ProjectService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/RepositoryModule.html" data-type="entity-link">RepositoryModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-RepositoryModule-4fc3ba1d42433ddece79a4f8d6f9cdbc"' : 'data-target="#xs-injectables-links-module-RepositoryModule-4fc3ba1d42433ddece79a4f8d6f9cdbc"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-RepositoryModule-4fc3ba1d42433ddece79a4f8d6f9cdbc"' :
                                        'id="xs-injectables-links-module-RepositoryModule-4fc3ba1d42433ddece79a4f8d6f9cdbc"' }>
                                        <li class="link">
                                            <a href="injectables/AuthRepository.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>AuthRepository</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                            <li class="link">
                                <a href="modules/UserModule.html" data-type="entity-link">UserModule</a>
                                <li class="chapter inner">
                                    <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ?
                                        'data-target="#injectables-links-module-UserModule-2b960658dca1775e91c0ba555cef1080"' : 'data-target="#xs-injectables-links-module-UserModule-2b960658dca1775e91c0ba555cef1080"' }>
                                        <span class="icon ion-md-arrow-round-down"></span>
                                        <span>Injectables</span>
                                        <span class="icon ion-ios-arrow-down"></span>
                                    </div>
                                    <ul class="links collapse" ${ isNormalMode ? 'id="injectables-links-module-UserModule-2b960658dca1775e91c0ba555cef1080"' :
                                        'id="xs-injectables-links-module-UserModule-2b960658dca1775e91c0ba555cef1080"' }>
                                        <li class="link">
                                            <a href="injectables/UserService.html"
                                                data-type="entity-link" data-context="sub-entity" data-context-id="modules" }>UserService</a>
                                        </li>
                                    </ul>
                                </li>
                            </li>
                </ul>
                </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#classes-links"' :
                            'data-target="#xs-classes-links"' }>
                            <span class="icon ion-ios-paper"></span>
                            <span>Classes</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="classes-links"' : 'id="xs-classes-links"' }>
                            <li class="link">
                                <a href="classes/AppError.html" data-type="entity-link">AppError</a>
                            </li>
                            <li class="link">
                                <a href="classes/AppUtils.html" data-type="entity-link">AppUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthCreatedEvent.html" data-type="entity-link">AuthCreatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthCreatedHandler.html" data-type="entity-link">AuthCreatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthDeletedEvent.html" data-type="entity-link">AuthDeletedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthDeletedHandler.html" data-type="entity-link">AuthDeletedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthEntity.html" data-type="entity-link">AuthEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthExistHandler.html" data-type="entity-link">AuthExistHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthExistQuery.html" data-type="entity-link">AuthExistQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResolver.html" data-type="entity-link">AuthResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthResponseDto.html" data-type="entity-link">AuthResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUpdatedEvent.html" data-type="entity-link">AuthUpdatedEvent</a>
                            </li>
                            <li class="link">
                                <a href="classes/AuthUpdatedHandler.html" data-type="entity-link">AuthUpdatedHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseDto.html" data-type="entity-link">BaseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseEntity.html" data-type="entity-link">BaseEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseRepository.html" data-type="entity-link">BaseRepository</a>
                            </li>
                            <li class="link">
                                <a href="classes/BaseSearchDto.html" data-type="entity-link">BaseSearchDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ConfigService.html" data-type="entity-link">ConfigService</a>
                            </li>
                            <li class="link">
                                <a href="classes/ContextProvider.html" data-type="entity-link">ContextProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuthCommand.html" data-type="entity-link">CreateAuthCommand</a>
                            </li>
                            <li class="link">
                                <a href="classes/CreateAuthHandler.html" data-type="entity-link">CreateAuthHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/DatabaseClient.html" data-type="entity-link">DatabaseClient</a>
                            </li>
                            <li class="link">
                                <a href="classes/Deferred.html" data-type="entity-link">Deferred</a>
                            </li>
                            <li class="link">
                                <a href="classes/DtoMapperUtils.html" data-type="entity-link">DtoMapperUtils</a>
                            </li>
                            <li class="link">
                                <a href="classes/FacebookAuth.html" data-type="entity-link">FacebookAuth</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAuthHandler.html" data-type="entity-link">GetAuthHandler</a>
                            </li>
                            <li class="link">
                                <a href="classes/GetAuthQuery.html" data-type="entity-link">GetAuthQuery</a>
                            </li>
                            <li class="link">
                                <a href="classes/GoogleAuth.html" data-type="entity-link">GoogleAuth</a>
                            </li>
                            <li class="link">
                                <a href="classes/GraphqlErrors.html" data-type="entity-link">GraphqlErrors</a>
                            </li>
                            <li class="link">
                                <a href="classes/HeadersDatasource.html" data-type="entity-link">HeadersDatasource</a>
                            </li>
                            <li class="link">
                                <a href="classes/HttpExceptionFilter.html" data-type="entity-link">HttpExceptionFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/LocalAuth.html" data-type="entity-link">LocalAuth</a>
                            </li>
                            <li class="link">
                                <a href="classes/NestjsEventStore.html" data-type="entity-link">NestjsEventStore</a>
                            </li>
                            <li class="link">
                                <a href="classes/NestStoreConfigProvider.html" data-type="entity-link">NestStoreConfigProvider</a>
                            </li>
                            <li class="link">
                                <a href="classes/NotFoundError.html" data-type="entity-link">NotFoundError</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageMetaDto.html" data-type="entity-link">PageMetaDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/PageOptionsDto.html" data-type="entity-link">PageOptionsDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/Paginate.html" data-type="entity-link">Paginate</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectEntity.html" data-type="entity-link">ProjectEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectResolver.html" data-type="entity-link">ProjectResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/ProjectResponseDto.html" data-type="entity-link">ProjectResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/QueryFailedFilter.html" data-type="entity-link">QueryFailedFilter</a>
                            </li>
                            <li class="link">
                                <a href="classes/SnakeNamingStrategy.html" data-type="entity-link">SnakeNamingStrategy</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserEntity.html" data-type="entity-link">UserEntity</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResolver.html" data-type="entity-link">UserResolver</a>
                            </li>
                            <li class="link">
                                <a href="classes/UserResponseDto.html" data-type="entity-link">UserResponseDto</a>
                            </li>
                            <li class="link">
                                <a href="classes/ValidationError.html" data-type="entity-link">ValidationError</a>
                            </li>
                        </ul>
                    </li>
                        <li class="chapter">
                            <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#injectables-links"' :
                                'data-target="#xs-injectables-links"' }>
                                <span class="icon ion-md-arrow-round-down"></span>
                                <span>Injectables</span>
                                <span class="icon ion-ios-arrow-down"></span>
                            </div>
                            <ul class="links collapse " ${ isNormalMode ? 'id="injectables-links"' : 'id="xs-injectables-links"' }>
                                <li class="link">
                                    <a href="injectables/AuthRepository.html" data-type="entity-link">AuthRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/AwsS3Service.html" data-type="entity-link">AwsS3Service</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/CookieSerializer.html" data-type="entity-link">CookieSerializer</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ErrorsInterceptor.html" data-type="entity-link">ErrorsInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/EventStore.html" data-type="entity-link">EventStore</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ExitInterceptor.html" data-type="entity-link">ExitInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/FacebookStrategy.html" data-type="entity-link">FacebookStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/GeneratorService.html" data-type="entity-link">GeneratorService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/LocalStrategy.html" data-type="entity-link">LocalStrategy</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ProjectRepository.html" data-type="entity-link">ProjectRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ReferencesExplorerService.html" data-type="entity-link">ReferencesExplorerService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/RepositoryService.html" data-type="entity-link">RepositoryService</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantMiddleware.html" data-type="entity-link">TenantMiddleware</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TenantRepository.html" data-type="entity-link">TenantRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/TimeoutInterceptor.html" data-type="entity-link">TimeoutInterceptor</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/UserRepository.html" data-type="entity-link">UserRepository</a>
                                </li>
                                <li class="link">
                                    <a href="injectables/ValidatorService.html" data-type="entity-link">ValidatorService</a>
                                </li>
                            </ul>
                        </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#guards-links"' :
                            'data-target="#xs-guards-links"' }>
                            <span class="icon ion-ios-lock"></span>
                            <span>Guards</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="guards-links"' : 'id="xs-guards-links"' }>
                            <li class="link">
                                <a href="guards/AuthGuard.html" data-type="entity-link">AuthGuard</a>
                            </li>
                            <li class="link">
                                <a href="guards/GqlAuthGuard.html" data-type="entity-link">GqlAuthGuard</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#interfaces-links"' :
                            'data-target="#xs-interfaces-links"' }>
                            <span class="icon ion-md-information-circle-outline"></span>
                            <span>Interfaces</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? ' id="interfaces-links"' : 'id="xs-interfaces-links"' }>
                            <li class="link">
                                <a href="interfaces/CollectionProps.html" data-type="entity-link">CollectionProps</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnCommonOptions.html" data-type="entity-link">ColumnCommonOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ColumnOptions.html" data-type="entity-link">ColumnOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/DBSource.html" data-type="entity-link">DBSource</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/Document.html" data-type="entity-link">Document</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EntityOptions.html" data-type="entity-link">EntityOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/EventStoreOptionConfig.html" data-type="entity-link">EventStoreOptionConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/FindRequest.html" data-type="entity-link">FindRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAuthRepo.html" data-type="entity-link">IAuthRepo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IAwsConfigInterface.html" data-type="entity-link">IAwsConfigInterface</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IConstraintErrors.html" data-type="entity-link">IConstraintErrors</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IDistributedGatewayOptions.html" data-type="entity-link">IDistributedGatewayOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventSourceConfig.html" data-type="entity-link">IEventSourceConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventStoreConnectConfig.html" data-type="entity-link">IEventStoreConnectConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IEventStoreMessage.html" data-type="entity-link">IEventStoreMessage</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IFile.html" data-type="entity-link">IFile</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGosipConfig.html" data-type="entity-link">IGosipConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IGosipConfig-1.html" data-type="entity-link">IGosipConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IndexDefinition.html" data-type="entity-link">IndexDefinition</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IPageMetaDtoParameters.html" data-type="entity-link">IPageMetaDtoParameters</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IServiceList.html" data-type="entity-link">IServiceList</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ITenantRepo.html" data-type="entity-link">ITenantRepo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/IUserRepo.html" data-type="entity-link">IUserRepo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MongoModuleAsyncOptions.html" data-type="entity-link">MongoModuleAsyncOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MongoModuleOptions.html" data-type="entity-link">MongoModuleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MongoOptionsFactory.html" data-type="entity-link">MongoOptionsFactory</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultiTenancyConfig.html" data-type="entity-link">MultiTenancyConfig</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/MultiTenantModuleOptions.html" data-type="entity-link">MultiTenantModuleOptions</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/ServiceListItem.html" data-type="entity-link">ServiceListItem</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/TenantInfo.html" data-type="entity-link">TenantInfo</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateByIdRequest.html" data-type="entity-link">UpdateByIdRequest</a>
                            </li>
                            <li class="link">
                                <a href="interfaces/UpdateRequest.html" data-type="entity-link">UpdateRequest</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <div class="simple menu-toggler" data-toggle="collapse" ${ isNormalMode ? 'data-target="#miscellaneous-links"'
                            : 'data-target="#xs-miscellaneous-links"' }>
                            <span class="icon ion-ios-cube"></span>
                            <span>Miscellaneous</span>
                            <span class="icon ion-ios-arrow-down"></span>
                        </div>
                        <ul class="links collapse " ${ isNormalMode ? 'id="miscellaneous-links"' : 'id="xs-miscellaneous-links"' }>
                            <li class="link">
                                <a href="miscellaneous/enumerations.html" data-type="entity-link">Enums</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/functions.html" data-type="entity-link">Functions</a>
                            </li>
                            <li class="link">
                                <a href="miscellaneous/variables.html" data-type="entity-link">Variables</a>
                            </li>
                        </ul>
                    </li>
                    <li class="chapter">
                        <a data-type="chapter-link" href="coverage.html"><span class="icon ion-ios-stats"></span>Documentation coverage</a>
                    </li>
                    <li class="divider"></li>
                    <li class="copyright">
                        Documentation generated using <a href="https://compodoc.app/" target="_blank">
                            <img data-src="images/compodoc-vectorise.png" class="img-responsive" data-type="compodoc-logo">
                        </a>
                    </li>
            </ul>
        </nav>
        `);
        this.innerHTML = tp.strings;
    }
});
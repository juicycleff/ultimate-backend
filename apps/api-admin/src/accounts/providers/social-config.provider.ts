import { EtcdConfig } from '@nestcloud/config/etcd-config';

export const facebookStrategyConfigFactory = {
  provide: 'FACEBOOK_STRATEGY_CONFIG',
  useFactory: (config: EtcdConfig) => {
    // const fbConfig = config.get<{clientID: string, clientSecret: string}>('app.auth.facebook');
    // console.log(fbConfig);
    return {
      clientID: '408656339979761',
      clientSecret: 'ccbf2b7ca62802d7ba63d40404716c16',
      callbackURL: 'https://4fadfbb2.ngrok.io/account/facebook/callback',
      profileFields: ['id', 'displayName', 'link', 'photos', 'emails', 'name'],
      passReqToCallback: true,
    };
  },
};

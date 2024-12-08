export const appRoutes = {
    home: '/',
    account: {
        login: '/login',
        expiredSession: '/login?errorCode=401',
        register: '/register',
        accountInfo: '/accountInfo',
    },
    observations: '/observations',
    leaderboard: '/learderboard',
    compare: '/compare',
    error: '/error',
    notFound: '*',
}



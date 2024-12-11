import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export { RouteGuard };

function RouteGuard({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        authCheck(pathname);
    }, [pathname]);


    function authCheck(url) {
        const isAuthenticated = localStorage.getItem('authToken') !== null;
        const publicPaths = ['/auth/login'];

        if (!isAuthenticated && !publicPaths.includes(url)) {
            setAuthorized(false);
            router.push('/auth/login');
        } else {
            setAuthorized(true);
        }
    }

    return authorized && children;
}

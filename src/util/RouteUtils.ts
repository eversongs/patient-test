import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import queryString from 'querystring';
import { useLocation } from 'react-router';

type TUseNavigateParams = {
    params?: Record<string, unknown>;
};
export default function useNavigateParams() {
    const navigate = useNavigate();
    const uLocation = useLocation();

    return (params: TUseNavigateParams, options?: {
        replace?: boolean;
    }) => {
        const path = axios.getUri({ url: uLocation.pathname, params });
        navigate(path, options);
    };
}


export function queryStringParse<T>(s: string): T | undefined {
    if (s === '') {
        return undefined;
    }
    const query: T = JSON.parse(JSON.stringify(queryString.parse(window.location.search.split('?')[1])));
    return query;
}

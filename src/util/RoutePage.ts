import { useEffect } from "react";
import useNavigateParams from './RouteUtils';
import { useLocation } from 'react-router';
import { queryStringParse } from './RouteUtils';

interface Options {
    merge?: boolean;
    replace?: boolean;
}

export interface RoutePageProp<Form, Param> {
    convertParamToForm: (p: Param) => Form,
    setForm: (t: Form) => void,
    initialValue?: Form
}

export default function useRoutePage<Form, Param>(prop: RoutePageProp<Form, Param>) {

    const navigateParams = useNavigateParams();

    const location = useLocation();

    const isInitRequired = (initialValue: Form | undefined, query: Param | undefined) => {

        if (initialValue) {
            const initRequiredParams = Object.keys(initialValue as any).filter(it => (initialValue as any)[it] !== undefined);
            if (initRequiredParams.length === 0) {
                return false;
            }
            const q = query as any;
            if (!query) {
                return true;
            }
            const paramInitRequired = initRequiredParams.map(it => (initialValue as any)[it] !== undefined && q[it] === undefined);
            return !paramInitRequired.every(it => it === false);
        }
        return false;
    }

    useEffect(() => {
        const query = queryStringParse<Param>(location.search);
        if (prop.initialValue && isInitRequired(prop.initialValue, query)) {
            navigateParams(prop.initialValue, {
                replace: true
            });
        } else {
            prop.setForm(prop.convertParamToForm(query!!));
        }
    }, [location]);


    return (param: Record<string, any>, options?: Options) => {
        // console.log(options?.merge);
        // console.log(param);
        if (options?.merge) {
            const query = queryStringParse<Param>(location.search);
            const p = {
                params: {
                    ...query,
                    ...param['params']
                }
            };
            navigateParams(p, options);
        } else {
            navigateParams(param, options);
        }

    };

}
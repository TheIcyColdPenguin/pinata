import { FC, useEffect, useRef } from 'react';

import hljs from 'highlight.js';

import sql from 'highlight.js/lib/languages/sql';
import 'highlight.js/styles/paraiso-dark.css';

import styles from '../styles/Code.module.css';

hljs.registerLanguage('sql', sql);
hljs.configure({ languages: ['sql'] });

export const Code: FC<{ code: string }> = ({ code }) => {
    const elem = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (elem.current) {
            elem.current.innerHTML = code
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
            hljs.highlightElement(elem.current);
        }
    });

    return (
        <div className={styles['code']}>
            <pre>
                <code ref={elem}>{code}</code>
            </pre>
        </div>
    );
};

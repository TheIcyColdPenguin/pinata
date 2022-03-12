import { FC } from 'react';
import { Code } from './Code';

import styles from '../styles/Level.module.css';

interface UnchangingProps {
    title: string;
    description: string;
    hint: string;
    question: string[];
}

export const UnchangingQuestionPart: FC<{ level: UnchangingProps }> = ({
    level: { title, description, hint, question },
}) => {
    return (
        <>
            {' '}
            <div className={styles['title']}>{title}</div>
            <div className={styles['desc']}>
                <p>{description}</p>
            </div>
            <div className={styles['hint']}>
                <div>{hint}</div>
            </div>
            <div className={styles['query']}>
                <Code code={question.join('')} />
            </div>
        </>
    );
};

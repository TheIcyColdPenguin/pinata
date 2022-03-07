import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import type { LevelDetails } from '../../types';

import { Code } from '../../components/Code';

import styles from '../../styles/Level.module.css';
import { ChangeEvent, useEffect, useState } from 'react';

const generateQuery = (template: string[], inputs: string[]) => {
    return template
        .flatMap((v, i) => [v, inputs[i]])
        .filter(i => i)
        .join('');
};

interface Table {
    columnNames: string[];
    rows: string[][];
}

const Level: NextPage<{ level: LevelDetails }> = ({ level }) => {
    const [inputs, setInputs] = useState<string[]>(Array(level.question.length - 1).fill(''));
    const [generatedQuery, setGeneratedQuery] = useState(generateQuery(level.question, inputs));
    const [queryResult, setQueryResult] = useState<Table>();

    useEffect(() => {
        setGeneratedQuery(generateQuery(level.question, inputs));
    }, [inputs]);

    const onInput = (e: ChangeEvent<HTMLInputElement>, index: number) => {
        setInputs(prevInputs => {
            const newInputs = [...prevInputs];
            newInputs[index] = e.target.value;
            return newInputs;
        });
    };

    const attemptlevel = async () => {
        const serverRes = await fetch(`http://localhost:8000/attempt/${level.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: inputs }),
        });

        if (!serverRes.ok) {
            alert('ono');
            return;
            // TODO: do smth like show a proper popup
        }

        const res = await serverRes.json();

        if (!res.query_result.length) {
            setQueryResult(undefined);
            return;
        }

        setQueryResult({
            columnNames: res.column_names,
            rows: res.query_result,
        });
    };

    return (
        <div className={styles['main']}>
            <div className={styles['title']}>{level.title}</div>
            <div className={styles['desc']}>{level.description}</div>
            <div className={styles['hint']}>{level.hint}</div>
            <div className={styles['query']}>
                <Code code={level.question.join('')} />
            </div>
            <div className={styles['input']}>
                {inputs.map((v, i) => (
                    <input key={i} value={v} onChange={e => onInput(e, i)} />
                ))}
            </div>
            <div className={styles['attempt']}>
                <button onClick={attemptlevel}>Attempt</button>
            </div>
            <div className={styles['generated']}>
                <Code code={generatedQuery} />
            </div>
            <div className={styles['table']}>
                {queryResult && (
                    <pre>
                        <code>
                            <table>
                                <thead>
                                    <tr>
                                        {queryResult.columnNames.map((v, i) => (
                                            <th key={i}>{v}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {queryResult.rows.map((row, i) => (
                                        <tr key={i}>
                                            {row.map((val, i) => (
                                                <td key={i}>{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </code>
                    </pre>
                )}
            </div>
        </div>
    );
};

export const getStaticProps: GetStaticProps<any, { level: string }> = async context => {
    const levelDetails: LevelDetails = await (
        await fetch(`http://localhost:8000/levels/${context.params?.level}`)
    ).json();

    return { props: { level: levelDetails ?? 'oh noes' } };
};

export const getStaticPaths: GetStaticPaths = async () => {
    const numLevels: number = (await (await fetch('http://localhost:8000/levels/all')).json()).length;

    const paths = Array(numLevels)
        .fill(0)
        .map((_, index) => {
            return {
                params: { level: `${index}` },
            };
        });

    return {
        paths,
        fallback: false,
    };
};

export default Level;

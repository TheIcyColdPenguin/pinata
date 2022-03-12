import { NextPage, GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';

import type { LevelDetails } from '../../types';

import { Code } from '../../components/Code';

import styles from '../../styles/Level.module.css';
import { ChangeEvent, useEffect, useState } from 'react';
import { UnchangingQuestionPart } from '../../components/UnchangingQuestionPart';

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
    const [flagInput, setFlagInput] = useState<string>('');
    const [solved, setSolved] = useState(false);

    const router = useRouter();

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

    const handleFlag = (e: ChangeEvent<HTMLInputElement>) => {
        setFlagInput(e.target.value);
    };

    const attemptlevel = async () => {
        const serverRes = await fetch(`http://localhost:8000/attempt/${level.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_input: inputs }),
        });

        try {
            const res = await serverRes.json();

            if (res.error) {
                alert(res.error);
                return;
            }

            if (!res.query_result.length) {
                setQueryResult(undefined);
                return;
            }

            setQueryResult({
                columnNames: res.column_names,
                rows: res.query_result,
            });
        } catch {
            if (!serverRes.ok) {
                alert('Something went wrong talking to the server');
                return;
                // TODO: do smth like show a proper popup
            }
        }
    };

    const verifyLevel = async () => {
        if (solved) {
            return;
        }
        const serverRes = await fetch(`http://localhost:8000/verify/${level.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ maybe_flag: flagInput }),
        });

        if (!serverRes.ok) {
            alert('ono');
            return;
            // TODO: do smth like show a proper popup
        }

        const res = await serverRes.json();

        if (res.correct) {
            alert('Congrats! You got the flag!');

            let currentSolves = JSON.parse(sessionStorage.getItem('solved') || '{}');
            currentSolves[level.id] = true;
            sessionStorage.setItem('solved', JSON.stringify(currentSolves));
            setSolved(true);

            router.push('/');
        } else {
            alert("Welp, that isn't the flag");
        }
    };

    return (
        <div className={styles['main']}>
            <UnchangingQuestionPart level={level} />
            <div className={styles['input']}>
                {inputs.map((v, i) => (
                    <input
                        key={i}
                        value={v}
                        onChange={e => onInput(e, i)}
                        onKeyDown={e => {
                            if (e.key == 'Enter') {
                                e.preventDefault();
                                e.stopPropagation();
                                attemptlevel();
                            }
                            console.log(e);
                            return false;
                        }}
                    />
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
            <div className={styles['verify']}>
                {queryResult && (
                    <>
                        <div>Enter flag: </div>
                        <input
                            value={flagInput}
                            onChange={handleFlag}
                            onKeyDown={e => {
                                if (e.key == 'Enter') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    verifyLevel();
                                }
                                return false;
                            }}
                        />
                    </>
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

import type { GetStaticProps } from 'next';

import { FC, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../styles/Home.module.css';

const Home: FC<{ levels: string[] }> = ({ levels }) => {
    const [selectedLevel, setSelectedLevel] = useState(0);
    const router = useRouter();

    const goToLevel = e => {
        e.preventDefault();
    };

    return (
        <div className={styles['grid']}>
            <div className={styles['title']}>SQL Injection</div>
            <div>sql injection is cool or smth</div>

            <form className={styles}>
                <select
                    name="level"
                    defaultValue={selectedLevel}
                    onChange={e => {
                        setSelectedLevel(Number.parseInt(e.target.value));
                    }}
                >
                    {levels.map((level, i) => (
                        <option value={i} key={i}>
                            {level}
                        </option>
                    ))}
                </select>
                <button type="submit" onClick={goToLevel}>
                    Attempt level{' '}
                    <pre>
                        <code>{levels[selectedLevel]}</code>
                    </pre>
                </button>
            </form>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const levels = await (await fetch('http://localhost:8000/levels/all')).json();

    return { props: { levels } };
};

export default Home;

import type { GetStaticProps } from 'next';

import { FC, MouseEvent as ReactMouseEvent, useState } from 'react';
import { useRouter } from 'next/router';

import styles from '../styles/Home.module.css';

const Home: FC<{ levels: string[] }> = ({ levels }) => {
    const [selectedLevel, setSelectedLevel] = useState(0);
    const router = useRouter();

    let finished: boolean = false;

    if (typeof window != 'undefined') {
        let solved = sessionStorage.getItem('solved');
        if (!solved) {
            solved = '{}';
            sessionStorage.setItem('solved', '{}');
        }

        let parsedSolved: { [id: number]: boolean } = JSON.parse(solved);

        finished = levels.reduce((acc: boolean, _, i) => acc && parsedSolved[i], true);
    }
    const goToLevel = (e: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        router.push(`/levels/${selectedLevel}`);
    };

    return (
        <div className={styles['grid']}>
            <div className={styles['title']}>Piñata</div>
            <div>sql injection is cool or smth</div>
            <div>
                <form className={styles['level-picker']}>
                    <select
                        name="level"
                        defaultValue={selectedLevel}
                        onChange={(e) => {
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
                        Attempt level
                    </button>
                </form>
            </div>
            <div>{finished && "Congratulations! You've completed all levels!"}</div>
        </div>
    );
};

export const getStaticProps: GetStaticProps = async () => {
    const levels = await (await fetch('http://localhost:8000/levels/all')).json();

    return { props: { levels } };
};

export default Home;

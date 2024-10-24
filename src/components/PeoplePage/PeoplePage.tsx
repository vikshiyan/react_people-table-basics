import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { PersonLink } from '../PersonLink';
import cn from 'classnames';

import { getPeople } from '../../api';
import { Person } from '../../types';
import { Loader } from '../Loader';

export const PeoplePage: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const { slug } = useParams();
  const selectedPerson = slug;

  useEffect(() => {
    setLoading(true);

    getPeople()
      .then(setPeople)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="section">
      <div className="container">
        <h1 className="title">People Page</h1>

        <div className="block">
          <div className="box table-container">
            {loading && <Loader />}

            {error && (
              <p data-cy="peopleLoadingError" className="has-text-danger">
                Something went wrong
              </p>
            )}

            {people.length === 0 && !loading && !error && (
              <p data-cy="noPeopleMessage">There are no people on the server</p>
            )}

            {people.length > 0 && !loading && (
              <table
                data-cy="peopleTable"
                className="table is-striped is-hoverable is-narrow is-fullwidth"
              >
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Sex</th>
                    <th>Born</th>
                    <th>Died</th>
                    <th>Mother</th>
                    <th>Father</th>
                  </tr>
                </thead>
                <tbody>
                  {people.map(person => {
                    const getHuman = (humanName: string | null) => {
                      if (!humanName) {
                        return null;
                      }

                      const foundPerson = people.find(
                        p => p.name === humanName,
                      );

                      return foundPerson ? foundPerson : humanName;
                    };

                    const renderHuman = (humanName: string | null) => {
                      const human = getHuman(humanName);

                      if (!human) {
                        return '-';
                      }

                      if (typeof human !== 'string') {
                        return <PersonLink person={human} />;
                      }

                      return humanName;
                    };

                    return (
                      <tr
                        data-cy="person"
                        key={person.slug}
                        className={cn({
                          'has-background-warning':
                            selectedPerson === person.slug,
                        })}
                      >
                        <td>
                          <PersonLink person={person} />
                        </td>
                        <td>{person.sex}</td>
                        <td>{person.born}</td>
                        <td>{person.died}</td>

                        <td>{renderHuman(person.motherName)}</td>
                        <td>{renderHuman(person.fatherName)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

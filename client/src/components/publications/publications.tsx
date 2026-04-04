import { useEffect, type FC } from 'react';
import { fetchPublications } from '../../services/publications/actions';
import { useDispatch } from '../../services/store';
import { PublicationsUI } from '../ui/publications/publications';

export const Publications: FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPublications());
  }, []);
  return <PublicationsUI />;
};

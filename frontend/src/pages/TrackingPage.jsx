import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrdersAPI } from '../services/api';
import { useI18n } from '../context/I18nContext';

export default function TrackingPage() {
  const { id } = useParams();
  const { t } = useI18n();
  const [status, setStatus] = useState('pending');
  const [eta, setEta] = useState(45);

  useEffect(() => {
    let mounted = true;
    OrdersAPI.tracking(id).then((res) => {
      if (!mounted) return;
      setStatus(res.status);
      setEta(res.etaMinutes);
    });
    const interval = setInterval(() => {
      OrdersAPI.tracking(id).then((res) => {
        if (!mounted) return;
        setStatus(res.status);
        setEta(res.etaMinutes);
      });
    }, 10000);
    return () => { mounted = false; clearInterval(interval); };
  }, [id]);

  return (
    <>
      <h2>{t('tracking.title')}</h2>
      <p>Status: <strong>{status}</strong></p>
      <p>{t('tracking.eta', { minutes: eta })}</p>
      <progress max="100" value={progressFromStatus(status)} aria-label="Order progress"></progress>
    </>
  );
}

function progressFromStatus(status) {
  switch (status) {
    case 'pending': return 10;
    case 'confirmed': return 25;
    case 'preparing': return 60;
    case 'out_for_delivery': return 90;
    case 'delivered': return 100;
    default: return 10;
  }
}
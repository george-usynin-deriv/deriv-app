import PropTypes from 'prop-types';
import React from 'react';
import { Loading } from '@deriv/components';
import { isCryptocurrency } from '@deriv/shared';
import { connect } from 'Stores/connect';
import CryptoDeposit from './crypto-deposit.jsx';
import CashierContainer from '../Components/cashier-container.jsx';
import CashierDefault from '../Components/CashierDefault/cashier-default.jsx';
import Error from '../Components/Error/error.jsx';
import Virtual from '../Components/Error/virtual.jsx';
import CashierLocked from '../Components/Error/cashier-locked.jsx';
import DepositsLocked from '../Components/Error/deposit-locked.jsx';
import FundsProtection from '../Components/Error/funds-protection.jsx';
import USDTSideNote from '../Components/usdt-side-note.jsx';
import CryptoTransactionsHistory from '../Components/Form/crypto-transactions-history';
import RecentTransaction from '../Components/recent-transaction.jsx';

// const DepositeSideNote = () => {
//     const notes = [
//         /*
//         <Localize i18n_default_text='This address can only be used once to make a deposit.' key={0} />,
//         <Localize
//             i18n_default_text='For each deposit you will have to visit here again to generate a new address.'
//             key={1}
//         />,
//         <Localize
//             i18n_default_text='Each transaction will be confirmed once we receive three confirmations from the blockchain.'
//             key={3}
//         />,
//         <Localize
//             i18n_default_text='To view confirmed transactions, kindly visit the <0>statement page</0>'
//             key={4}
//             components={[<Link to='/reports/statement' key={0} className='link link--orange' />]}
//         />,
//         */
//     ];
//     const side_note_title =
//         notes?.length > 1 ? <Localize i18n_default_text='Notes' /> : <Localize i18n_default_text='Note' />;

//     return <SideNote has_bullets notes={notes} title={side_note_title} />;
// };

const Deposit = ({
    crypto_transactions,
    container,
    currency,
    current_currency_type,
    error,
    is_cashier_locked,
    is_cashier_default,
    is_crypto_transactions_visible,
    is_deposit,
    is_deposit_locked,
    is_eu,
    iframe_height,
    iframe_url,
    is_loading,
    is_switching,
    is_system_maintenance,
    is_virtual,
    onMount,
    recentTransactionOnMount,
    setActiveTab,
    setIsDeposit,
    setSideNotes,
    tab_index,
}) => {
    const is_crypto = !!currency && isCryptocurrency(currency);

    React.useEffect(() => {
        if (!is_crypto_transactions_visible) {
            recentTransactionOnMount();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_switching]);

    React.useEffect(() => {
        setActiveTab(container);
        onMount();
        return () => setIsDeposit(false);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [setActiveTab, onMount, container]);

    React.useEffect(() => {
        if (typeof setSideNotes === 'function') {
            if (is_switching || is_deposit) setSideNotes(null);
            if (isCryptocurrency(currency) && is_deposit && !is_switching) {
                const side_notes = [
                    ...(crypto_transactions.length ? [<RecentTransaction key={2} />] : []),
                    ...(/^(UST)$/i.test(currency) ? [<USDTSideNote type='usdt' key={1} />] : []),
                    ...(/^(eUSDT)$/i.test(currency) ? [<USDTSideNote type='eusdt' key={1} />] : []),
                ];
                if (side_notes.length > 0) setSideNotes(side_notes);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, tab_index, crypto_transactions, is_cashier_default]);

    if ((is_switching || (is_loading && !iframe_url)) && !is_crypto_transactions_visible) {
        return <Loading is_fullscreen />;
    }
    if (is_virtual) {
        return <Virtual />;
    }
    if (is_system_maintenance) {
        if (is_cashier_locked || (is_deposit_locked && current_currency_type === 'crypto')) {
            return <CashierLocked />;
        }
    }
    if (error.is_ask_uk_funds_protection) {
        return <FundsProtection />;
    }
    if (is_cashier_locked) {
        return <CashierLocked />;
    }
    if (is_deposit_locked) {
        return <DepositsLocked />;
    }
    if (is_crypto_transactions_visible) {
        return <CryptoTransactionsHistory />;
    }

    if (is_deposit || is_eu) {
        if (error.message) {
            return <Error error={error} />;
        }
        if (isCryptocurrency(currency)) {
            return <CryptoDeposit />;
        }

        return (
            <CashierContainer
                iframe_height={iframe_height}
                iframe_url={iframe_url}
                is_loading={is_loading}
                is_crypto={is_crypto}
            />
        );
    }
    return <CashierDefault setSideNotes={setSideNotes} />;
};

Deposit.propTypes = {
    crypto_transactions: PropTypes.array,
    container: PropTypes.string,
    current_currency_type: PropTypes.string,
    error: PropTypes.object,
    is_cashier_default: PropTypes.bool,
    is_cashier_locked: PropTypes.bool,
    is_deposit: PropTypes.bool,
    is_crypto_transactions_visible: PropTypes.bool,
    is_deposit_locked: PropTypes.bool,
    is_eu: PropTypes.bool,
    iframe_height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    iframe_url: PropTypes.string,
    is_loading: PropTypes.bool,
    is_switching: PropTypes.bool,
    is_system_maintenance: PropTypes.bool,
    is_virtual: PropTypes.bool,
    onMount: PropTypes.func,
    recentTransactionOnMount: PropTypes.func,
    setActiveTab: PropTypes.func,
    setIsDeposit: PropTypes.func,
    setSideNotes: PropTypes.func,
    standpoint: PropTypes.object,
    tab_index: PropTypes.number,
};

export default connect(({ client, modules }) => ({
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    container: modules.cashier.config.deposit.container,
    currency: client.currency,
    current_currency_type: client.current_currency_type,
    error: modules.cashier.config.deposit.error,
    is_cashier_default: modules.cashier.is_cashier_default,
    is_cashier_locked: modules.cashier.is_cashier_locked,
    is_crypto_transactions_visible: modules.cashier.transaction_history.is_crypto_transactions_visible,
    is_deposit: modules.cashier.is_deposit,
    is_deposit_locked: modules.cashier.is_deposit_locked,
    is_eu: client.is_eu,
    iframe_height: modules.cashier.config.deposit.iframe_height,
    iframe_url: modules.cashier.config.deposit.iframe_url,
    is_loading: modules.cashier.is_loading,
    is_system_maintenance: modules.cashier.is_system_maintenance,
    is_switching: client.is_switching,
    is_virtual: client.is_virtual,
    onMount: modules.cashier.onMount,
    recentTransactionOnMount: modules.cashier.transaction_history.onMount,
    setActiveTab: modules.cashier.setActiveTab,
    setIsDeposit: modules.cashier.setIsDeposit,
    standpoint: client.standpoint,
    tab_index: modules.cashier.cashier_route_tab_index,
}))(Deposit);

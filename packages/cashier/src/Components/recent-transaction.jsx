import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';
import { ButtonLink, Text, Icon } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { epochToMoment } from '@deriv/shared';
import { connect } from 'Stores/connect';
import { getStatus } from '../Constants/transaction-status';
import '../Sass/recent-transaction.scss';

const RecentTransaction = ({ crypto_transactions, currency, onMount, setIsCryptoTransactionsVisible }) => {
    React.useEffect(() => {
        onMount();
    }, [onMount]);

    if (!crypto_transactions.length) {
        return null;
    }

    let { address_hash, submit_date, transaction_type } = crypto_transactions[0];
    const {status_code, transaction_hash} = crypto_transactions[0];
    const status = getStatus(transaction_hash, transaction_type, status_code);
    submit_date = epochToMoment(submit_date).format('MMM D, YYYY');
    transaction_type = transaction_type[0].toUpperCase() + transaction_type.slice(1);
    address_hash = `${address_hash.substring(0, 4)}....${address_hash.substring(address_hash.length - 4)}`;

    const amount = crypto_transactions[0].amount;

    const onClickViewAll = () => {
        setIsCryptoTransactionsVisible(true);
    };

    return (
        <div className='cashier-recent-transaction-wrapper'>
            <div className='cashier-recent-transaction'>
                <Text weight='bold' as='p' line_height='s' size='xs'>
                    <Localize i18n_default_text='Recent Transactions' />
                </Text>
                <div className='cashier-recent-transaction__data-wrapper'>
                    <Icon
                        className='cashier-recent-transaction__icon'
                        icon={transaction_type === 'deposit' ? 'IcCashierAdd' : 'IcCashierMinus'}
                        size={32}
                    />
                    <div>
                        <div className='cashier-recent-transaction__status-wrapper'>
                            <Text as='p' size='xxs'>
                                <Localize
                                    i18n_default_text='{{transaction_type}} {{currency}}'
                                    values={{
                                        transaction_type,
                                        currency,
                                    }}
                                />
                            </Text>
                            <div className='cashier-recent-transaction__status'>
                                <span
                                    className={classNames('cashier-recent-transaction__status-indicator', 
                                        `cashier-recent-transaction__status-indicator-${status.renderer}`
                                    )}
                                />
                                <Text as='p' size='xxxs'>
                                    {status.name}
                                </Text>
                            </div>
                        </div>
                        <Text as='p' size='xxxs' color='less-prominent' line_height='s'>
                            <Localize
                                i18n_default_text='{{amount}} {{currency}} on {{submit_date}}'
                                values={{
                                    amount,
                                    currency,
                                    submit_date,
                                }}
                            />
                        </Text>
                        <div className='cashier-recent-transaction__hash-wrapper'>
                            <div className='cashier-recent-transaction__hash'>
                                <Text as='p' size='xxxs' line_height='s'>
                                    <Localize i18n_default_text='Address:' />
                                    &nbsp;
                                </Text>
                                <Text as='p' size='xxxs' color='red' line_height='s'>
                                    {address_hash}
                                </Text>
                            </div>

                            <div className='cashier-recent-transaction__hash'>
                                <Text as='p' size='xxxs' line_height='xs'>
                                    <Localize i18n_default_text='Transaction hash:' />
                                    &nbsp;
                                </Text>
                                <Text as='p' size='xxxs' color='red' line_height='s'>
                                    {status.transaction_hash}
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>
                <ButtonLink
                    to='#'
                    className='dc-btn--secondary cashier-recent-transaction__view-all-button'
                    onClick={onClickViewAll}
                >
                    <Text weight='bold' as='p' size='xxs'>
                        <Localize i18n_default_text='View all' />
                    </Text>
                </ButtonLink>
            </div>
        </div>
    );
};

RecentTransaction.propTypes = {
    crypto_transactions: PropTypes.array,
    currency: PropTypes.string,
    onMount: PropTypes.func,
    setIsCryptoTransactionsVisible: PropTypes.func,
};

export default connect(({ modules, client }) => ({
    crypto_transactions: modules.cashier.transaction_history.crypto_transactions,
    currency: client.currency,
    onMount: modules.cashier.transaction_history.onMount,
    setIsCryptoTransactionsVisible: modules.cashier.transaction_history.setIsCryptoTransactionsVisible,
}))(RecentTransaction);

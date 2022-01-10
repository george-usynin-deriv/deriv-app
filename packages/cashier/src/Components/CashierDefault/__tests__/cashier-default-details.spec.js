import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import CashierDefaultDetails from '../cashier-default-details';

jest.mock('Stores/connect.js', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<CashierDefaultDetails />', () => {
    let props;
    beforeEach(() => {
        props = {
            detail_click: jest.fn(),
            detail_description: 'Deposit via the following payment methods:',
            detail_header: 'Deposit via bank wire, credit card, and e-wallet',
            is_dark_mode_on: false,
            is_mobile: false,
            detail_contents: [
                {
                    icons: [
                        {
                            dark: 'IcWalletCreditDebitDark',
                            light: 'IcWalletCreditDebitLight',
                        },
                    ],
                },
            ],
        };
    });

    it('should show the proper messages', () => {
        render(<CashierDefaultDetails {...props} />);

        expect(screen.getByText('Deposit via bank wire, credit card, and e-wallet')).toBeInTheDocument();
        expect(screen.getByText('Deposit via the following payment methods:')).toBeInTheDocument();
    });

    it('should show contain the correct className, when detail_contents has icons', () => {
        const { container } = render(<CashierDefaultDetails {...props} />);

        expect(container.querySelector('.cashier-default-detail__array')).not.toBe(null);
    });

    it('should trigger onClick callback, when the user clicks on the block with details', () => {
        const { container } = render(<CashierDefaultDetails {...props} />);

        const details_block = container.querySelector('.cashier-default-detail__div');
        fireEvent.click(details_block);

        expect(props.detail_click).toHaveBeenCalledTimes(1);
    });
});

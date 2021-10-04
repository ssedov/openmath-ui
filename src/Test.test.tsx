import React from 'react';
import {render, screen} from '@testing-library/react';
import Test from './Test';
import Config from "./Config";

const FAKE_TESTS: any = {
    'basic_test': {
        title: 'Basic test',
        questions: []
    }
}

test('loading displayed', () => {
    Config.API = undefined;
    render(<Test test_id='test_test' />);
    const element = screen.getByText(/Loading/i);
    expect(element).toBeInTheDocument();
});

test('title displayed', () => {
    render(<Test test_id='test_test' data={FAKE_TESTS['basic_test']} />);
    const linkElement = screen.getByText(/Basic test/i);
    expect(linkElement).toBeInTheDocument();
});

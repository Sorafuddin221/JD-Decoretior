'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { askQuestion, answerQuestion, removeQuerySuccess, getProductDetails } from '@/features/products/productSlice';
import { toast } from 'react-toastify';
import '@/componentStyles/CustomerQueryTab.css';

function CustomerQueryTab({ product, user }) {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState('');
    const [selectedQueryId, setSelectedQueryId] = useState(null);

    const dispatch = useDispatch();
    const { queryLoading, querySuccess, error } = useSelector((state) => state.product);

    useEffect(() => {
        if (querySuccess) {
            toast.success('Your action has been completed successfully!', { position: 'top-center', autoClose: 3000 });
            setQuestion('');
            setAnswer('');
            setSelectedQueryId(null);
            dispatch(removeQuerySuccess());
            dispatch(getProductDetails(product._id)); // Re-fetch product details
        }
        if (error) {
            toast.error(error, { position: 'top-center', autoClose: 3000 });
        }
    }, [querySuccess, error, dispatch, product._id]);

    const handleQuestionSubmit = (e) => {
        e.preventDefault();
        if (!question) {
            toast.error('Please enter your question before submitting.', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(askQuestion({
            question,
            productId: product._id
        }));
    };

    const handleAnswerSubmit = (e, queryId) => {
        e.preventDefault();
        if (!answer) {
            toast.error('Please enter your answer before submitting.', { position: 'top-center', autoClose: 3000 });
            return;
        }
        dispatch(answerQuestion({
            answer,
            productId: product._id,
            queryId
        }));
    };

    return (
        <div className="customer-query-container">
            <h3>Customer Queries</h3>

            <div className="queries-list">
                {product.customerQueries && product.customerQueries.length > 0 ? (
                    product.customerQueries.map((query) => (
                        <div key={query._id} className="query-item">
                            <p><strong>Question:</strong> {query.question}</p>
                            <p className="query-name">By: {query.name}</p>
                            {query.answer ? (
                                <p><strong>Answer:</strong> {query.answer}</p>
                            ) : (
                                user.role === 'admin' && (
                                    <form onSubmit={(e) => handleAnswerSubmit(e, query._id)}>
                                        <textarea
                                            value={selectedQueryId === query._id ? answer : ''}
                                            onChange={(e) => {
                                                setAnswer(e.target.value);
                                                setSelectedQueryId(query._id);
                                            }}
                                            placeholder="Write your answer..."
                                            required
                                        ></textarea>
                                        <button type="submit" disabled={queryLoading}>
                                            {queryLoading ? 'Submitting...' : 'Submit Answer'}
                                        </button>
                                    </form>
                                )
                            )}
                        </div>
                    ))
                ) : (
                    <p>No questions yet. Ask the first one!</p>
                )}
            </div>

            <form className="query-form" onSubmit={handleQuestionSubmit}>
                <h4>Ask a Question</h4>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Write your question here..."
                    required
                ></textarea>
                <button type="submit" disabled={queryLoading}>
                    {queryLoading ? 'Submitting...' : 'Submit Question'}
                </button>
            </form>
        </div>
    );
}

export default CustomerQueryTab;

import React, { useState } from 'react';
import BaseForm from '../../BaseForm';
import { makePrivateRequest } from 'core/utils/request';
import './styles.scss';
import { useForm } from 'react-hook-form';

type FormState = {
    name: string;
    price: string;
    category?: string;
    description: string;
    imgUrl: string;
}

type FormEvent = React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>;

const Form = () => {

    const { register, handleSubmit } = useForm<FormState>();

    const onSubmit = (data: FormState) => {
        makePrivateRequest({ url: '/products', method: 'POST', data });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <BaseForm title="CADASTRAR UM PRODUTO">
                <div className="row">
                    <div className="col-6">
                        <input
                            {...register('name')}
                            name="name"
                            type="text"
                            className="form-control margin-bottom-30 input-base"
                            placeholder="Nome do Produto"
                        />
                        {/* <select
                            value={formData.category}
                            name="category"
                            id=""
                            className="form-control mb-5"
                            onChange={handleOnChange}
                        >
                            <option value="1">Livros</option>
                            <option value="3">Computadores</option>
                            <option value="2">Eletrônicos</option>
                        </select> */}
                        <input
                            {...register('price')}
                            name="price"
                            type="number"
                            className="form-control margin-bottom-30 input-base"
                            placeholder="Preço"
                        />
                        <input
                            {...register('imgUrl')}
                            name="imgUrl"
                            type="text"
                            className="form-control margin-bottom-30 input-base"
                            placeholder="Url da imagem do Produto"
                        />
                    </div>
                    <div className="col-6">
                        <textarea
                            {...register('description')}
                            name="description"
                            className="form-control input-base"
                            placeholder='Descrição'
                            cols={30}
                            rows={10}
                        />
                    </div>
                </div>
            </BaseForm>
        </form>
    );
}

export default Form;

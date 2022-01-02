import './styles.scss';

import { makePrivateRequest, makeRequest } from 'core/utils/request';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { useHistory, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Select from 'react-select';

import BaseForm from '../../BaseForm';
import { Category } from 'core/types/Category';
import PriceField from './PriceField';
import ImageUpload from '../ImageUpload';


export type FormState = {
  name: string;
  price: number;
  categories: Category[];
  description: string;
  imgUrl: string;
}
type ParamsType = {
  productId: string;
}

const Form = () => {

  const { register, handleSubmit, formState: { errors }, setValue, control } = useForm<FormState>();
  const history = useHistory();
  const { productId } = useParams<ParamsType>();
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [uploadedImgUrl, setUploadedImgUrl] = useState('');
  const [productImgUrl, setProductImgUrl] = useState('');
  const isEditing = productId !== 'create';
  const formTitle = isEditing ? 'Editar produto' : 'Cadastrar produto';

  useEffect(() => {
    if (isEditing) {
      makeRequest({ url: `/products/${productId}` })
        .then(response => {
          setValue('name', response.data.name);
          setValue('price', response.data.price);
          setValue('description', response.data.description);
          setValue('categories', response.data.categories);
          setProductImgUrl(response.data.imgUrl);
        });
    }
  }, [productId, isEditing, setValue]);

  useEffect(() => {
    setIsLoadingCategories(true);
    makeRequest({ url: '/categories' })
      .then(response => setCategories(response.data.content))
      .finally(() => setIsLoadingCategories(false));
  }, [])

  const onSubmit = (data: FormState) => {
    // debugger
    if (typeof data.price == 'string') {
      const value = String (data.price).replace(',','.');
      data.price = Number(value);
    }
    // data.price = data.price.replace(',','.');
    const payload = {
      ...data,
      imgUrl: uploadedImgUrl || productImgUrl
    }
    makePrivateRequest(
      {
        url: isEditing ? `/products/${productId}` : '/products',
        method: isEditing ? 'PUT' : 'POST',
        data: payload
      }
    )
      .then(() => {
        toast.info("Produto salvo com sucesso!");
        history.push("/admin/products");
      })
      .catch(() => {
        toast.error("Erro ao salvar produto!")
      })
  }

  const onUploadImgSuccess = (imgUrl: string) => {
    setUploadedImgUrl(imgUrl);
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <BaseForm title={formTitle}>
        <div className="product-form-container">
          <div className="col-6">

            <div className='margin-bottom-30'>
              <input
                {...register('name',
                  {
                    required: {
                      value: true,
                      message: "Campo obrigatório"
                    },
                    minLength: {
                      value: 5,
                      message: "Deve ter no mínimo 5 caracteres"
                    },
                    maxLength: {
                      value: 60,
                      message: "Deve ter no máximo 60 caracteres"
                    }
                  }
                )}
                name="name"
                type="text"
                className={`form-control input-base ${errors.name ? 'is-invalid' : ''}`}
                placeholder="Nome do Produto"
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className='margin-bottom-30'>
              <Controller
                name='categories'
                rules={{required: true}}
                control={control}
                render={({field}) => (
                  <Select
                    {...field}
                    options={categories}
                    getOptionLabel={(option: Category) => option.name}
                    getOptionValue={(option: Category) => String(option.id)}
                    classNamePrefix="categories-select"
                    placeholder="Categorias"
                    isMulti
                    isLoading={isLoadingCategories}
                  />
                )}

              />
              {errors.categories && (
                <div className="invalid-feedback d-block">
                  Campo obrigatório
                </div>
              )}


            </div>

            <div className="margin-bottom-30">
              <PriceField control={control} />
              {errors.price && (
                <div className="invalid-feedback d-block">
                  {errors.price.message}
                </div>
              )}
            </div>

            <div className="margin-bottom-30">
              <ImageUpload 
                onUploadSuccess={onUploadImgSuccess}
                productImgUrl={productImgUrl}
                />
            </div>

          </div>
          <div className="col-6">
            <textarea
              {...register('description',
                {
                  required: {
                    value: true,
                    message: "Campo obrigatório"
                  }
                }
              )}
              name="description"
              className={`form-control input-base ${errors.description ? 'is-invalid' : ''}`}
              placeholder='Descrição'
              cols={30}
              rows={10}
            />
            {errors.description && (
              <div className="invalid-feedback">
                {errors.description.message}
              </div>
            )}
          </div>
        </div>
      </BaseForm>
    </form>
  );
}

export default Form;

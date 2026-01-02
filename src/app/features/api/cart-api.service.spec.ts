import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartApiService } from './cart-api.service';
import { Cart } from '../../core/models/cart.model';
import { environment } from '../../../environments/environment';

describe('CartApiService', () => {
  let service: CartApiService;
  let httpMock: HttpTestingController;

  const mockCart: Cart = {
    id: 1,
    userId: '123',
    items: [
      { id: 1, productId: 101, quantity: 2, productName: 'Item A', price: 50, subtotal: 100 },
      { id: 2, productId: 102, quantity: 1, productName: 'Item B', price: 30, subtotal: 30 }
    ],
    totalPrice: 130,
    tax: 10,
    discount: 0
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartApiService]
    });

    service = TestBed.inject(CartApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch cart items', () => {
    service.getCart().subscribe(cart => {
      expect(cart).toEqual(mockCart);
      expect(cart.items.length).toBe(2);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cart`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCart);
  });

  it('should add an item to the cart', () => {
    const newItem = { productId: 103, quantity: 1 };
    service.addItem(newItem.productId, newItem.quantity).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cart/add`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newItem);
    req.flush(mockCart);
  });

  it('should update an item in the cart', () => {
    const updateData = { cartItemId: 1, quantity: 3 };
    service.updateItem(updateData.cartItemId, updateData.quantity).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cart/update`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updateData);
    req.flush(mockCart);
  });

  it('should remove an item from the cart', () => {
    const cartItemId = 2;
    service.removeItem(cartItemId).subscribe(cart => {
      expect(cart).toEqual(mockCart);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/cart/remove`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.body).toEqual({ cartItemId });
    req.flush(mockCart);
  });

 it('should clear the cart', () => {
  service.clearCart().subscribe(res => {
    expect(res).toBeNull(); 
  });

  const req = httpMock.expectOne(`${environment.apiUrl}/cart/clear`);
  expect(req.request.method).toBe('DELETE');
  req.flush(null); 
});


});

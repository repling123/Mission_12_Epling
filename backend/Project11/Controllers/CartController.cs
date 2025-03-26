using Microsoft.AspNetCore.Mvc;
using Project11.Models;
using System.Collections.Generic;

namespace Project11.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private static List<CartItem> _cart = new List<CartItem>(); // ✅ In-memory cart storage

        // ✅ Get Cart Items
        [HttpGet]
        public ActionResult<IEnumerable<CartItem>> GetCart()
        {
            return Ok(_cart);
        }

        // ✅ Add Book to Cart (or Increase Quantity)
        [HttpPost("add")]
        public ActionResult AddToCart([FromBody] CartItem item)
        {
            var existingItem = _cart.Find(b => b.BookID == item.BookID);

            if (existingItem != null)
            {
                existingItem.Quantity++; // ✅ Increase quantity if already in cart
            }
            else
            {
                _cart.Add(new CartItem
                {
                    BookID = item.BookID,
                    Title = item.Title,
                    Price = item.Price,
                    Quantity = item.Quantity
                });
            }

            return Ok(_cart);
        }

        // ✅ Remove Book from Cart
        [HttpPost("remove")]
        public ActionResult RemoveFromCart([FromBody] CartItem item)
        {
            var existingItem = _cart.Find(b => b.BookID == item.BookID);

            if (existingItem != null)
            {
                existingItem.Quantity--;
                if (existingItem.Quantity <= 0)
                {
                    _cart.Remove(existingItem);
                }
            }

            return Ok(_cart);
        }

        // ✅ Clear Cart
        [HttpPost("clear")]
        public ActionResult ClearCart()
        {
            _cart.Clear();
            return Ok();
        }
    }
}

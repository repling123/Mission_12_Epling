using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace Project11.Models
{
    public class CartItem
    {
        public int BookID { get; set; }
        public string Title { get; set; } = null!;
        public decimal Price { get; set; }
        public int Quantity { get; set; } = 1; // ✅ Default Quantity = 1
    }
}

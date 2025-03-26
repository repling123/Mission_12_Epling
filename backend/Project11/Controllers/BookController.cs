using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Project11.Data;
using Project11.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Project11.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public BookController(ApplicationDbContext context)
        {
            _context = context;
        }

        // ✅ GET: api/Book (Supports Filtering & Pagination)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Book>>> GetBooks(
        [FromQuery] string? category = null,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 5)
        {
            // ✅ Ensure page numbers are valid
            if (page < 1 || pageSize < 1)
                return BadRequest("Page number and page size must be at least 1.");

            // ✅ Start with all books
            IQueryable<Book> query = _context.Books;

            // ✅ Filter by category if not null or empty
            if (!string.IsNullOrWhiteSpace(category))
            {
                query = query.Where(b => b.Category == category);
            }

            // ✅ Get total book count for pagination
            int totalBooks = await query.CountAsync();

            // ✅ Apply sorting and pagination
            var books = await query
                .OrderBy(b => b.Title) // Always sort alphabetically
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            // ✅ Return both totalBooks & paginated results
            return Ok(new
            {
                TotalBooks = totalBooks,
                Books = books
            });
        }


        // ✅ GET: api/Book/categories (Returns List of Categories)
        [HttpGet("categories")]
        public async Task<ActionResult<IEnumerable<string>>> GetCategories()
        {
            var categories = await _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToListAsync();

            return Ok(categories);
        }

        // ✅ GET: api/Book/5 (Get Single Book)
        [HttpGet("{id}")]
        public async Task<ActionResult<Book>> GetBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();
            return book;
        }

        // ✅ POST: api/Book (Add New Book)
        [HttpPost]
        public async Task<ActionResult<Book>> AddBook(Book book)
        {
            _context.Books.Add(book);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetBook), new { id = book.BookID }, book);
        }

        // ✅ PUT: api/Book/5 (Update Book)
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, Book book)
        {
            if (id != book.BookID) return BadRequest();

            _context.Entry(book).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // ✅ DELETE: api/Book/5 (Delete Book)
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var book = await _context.Books.FindAsync(id);
            if (book == null) return NotFound();

            _context.Books.Remove(book);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}

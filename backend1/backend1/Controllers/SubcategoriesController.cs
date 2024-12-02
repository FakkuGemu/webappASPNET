using backend1.Data;
using Microsoft.AspNetCore.Mvc;

namespace backend1.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SubcategoriesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public SubcategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetSubcategories()
        {
            var subcategories = _context.Subcategories.ToList();
            return Ok(subcategories);
        }

        [HttpGet("byCategory/{categoryId}")]
        public IActionResult GetSubcategoriesByCategory(int categoryId)
        {
            var subcategories = _context.Subcategories
                .Where(s => s.CategoryId == categoryId)
                .ToList();
            return Ok(subcategories);
        }
    }
}
